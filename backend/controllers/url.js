import Url from "../models/Url.js";
import shortid from "shortid";
import useragent from "useragent";
import { getGeolocation } from "../utils/getGeoLocation.js";
import User from "../models/User.js";

const shortenUrl = async (req, res) => {
  const { originalUrl, customUrl, useCustomUrl, platform } = req.body;
  let shortUrl;
  if (platform) {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const existingSocial = user.socials.find(
      (social) => social.platform === platform
    );
    if (existingSocial) {
      return res
        .status(400)
        .json({ error: "Social media link already exists" }); // Return error if social media link exists
    }

    user.socials.push({ platform, url: originalUrl });
    shortUrl = `${user.username}/${platform}`;
    const [, existingUrl] = await Promise.all([
      user.save(),
      Url.findOne({ shortUrl, originalUrl }),
    ]);

    if (existingUrl) {
      return res.status(200).json({ shortUrl }); // Added return here
    }
  } else if (useCustomUrl && customUrl) {
    if (customUrl.includes("/")) {
      return res
        .status(400)
        .json({ error: "Custom URL cannot contain slashes" });
    }
    shortUrl = customUrl;
    const existingUrl = await Url.findOne({ shortUrl });
    if (existingUrl) {
      return res.status(400).json({ error: "Custom URL is already in use" });
    }
  } else {
    shortUrl = shortid.generate();
  }

  try {
    let url = new Url({
      originalUrl,
      shortUrl,
      user: req.userId,
    });
    await url.save();
    res.json(url);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: "Error fetching URLs" });
  }
};

const redirectToOriginalUrl = async (req, res) => {
  try {
    let url;
    if (req.isPlatform) {
      url = await Url.findOne({
        shortUrl: `${req.params.username}/${req.params.platform}`,
      });
    } else {
      url = await Url.findOne({ shortUrl: req.params.shortUrl });
    }
    if (url) {
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      // const ip = "49.36.144.48";
      const geo = await getGeolocation(ip);
      const userAgent = req.headers["user-agent"];
      const referrer = req.headers["referer"] || "Direct";
      const agent = useragent.parse(userAgent);
      // Add analytics data to URL model
      url.analytics.push({
        ip,
        userAgent,
        referrer,
        location: {
          country: geo?.country,
          city: geo?.city,
          latitude: geo?.lat, // Extract latitude
          longitude: geo?.lon, // Extract longitude
        },
        deviceType: agent.device.toString(),
        os: agent.os.toString(),
        browser: agent.toAgent(),
        language: req.headers["accept-language"],
      });

      await url.save();
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: "No URL found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!url) {
      return res.status(404).json({ error: "URL not found or not authorized" });
    }
    res.json({ message: "URL deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateUrl = async (req, res) => {
  const { originalUrl, customUrl } = req.body;
  let shortUrl;

  if (customUrl) {
    if (customUrl.includes("/")) {
      return res
        .status(400)
        .json({ error: "Custom URL cannot contain slashes" });
    }
    const existingUrl = await Url.findOne({ shortUrl: customUrl });
    if (existingUrl && existingUrl._id.toString() !== req.params.id) {
      return res.status(400).json({ error: "Custom URL is already in use" });
    }
    shortUrl = customUrl;
  } else {
    shortUrl = shortid.generate();
  }

  try {
    const url = await Url.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { originalUrl, shortUrl },
      { new: true }
    );
    if (!url) {
      return res.status(404).json({ error: "URL not found or not authorized" });
    }
    res.json(url);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getURL = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) {
      return res.status(404).json({ error: "URL not found or not authorized" });
    }
    res.json(url);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export default {
  shortenUrl,
  getUrls,
  redirectToOriginalUrl,
  deleteUrl,
  updateUrl,
  getURL,
};
