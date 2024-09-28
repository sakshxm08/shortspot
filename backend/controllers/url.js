import Url from "../models/Url.js";
import shortid from "shortid";
import geoip from "geoip-lite";
import useragent from "useragent";

const shortenUrl = async (req, res) => {
  const { originalUrl, customUrl, useCustomUrl } = req.body;
  let shortUrl;

  if (useCustomUrl && customUrl) {
    if (customUrl.includes("/")) {
      return res
        .status(400)
        .json({ error: "Custom URL cannot contain slashes" });
    }
    const existingUrl = await Url.findOne({ shortUrl: customUrl });
    if (existingUrl) {
      return res.status(400).json({ error: "Custom URL is already in use" });
    }
    shortUrl = customUrl;
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
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (url) {
      // const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const ip = "49.36.144.48";
      const geo = geoip.lookup(ip);
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
          latitude: geo?.ll ? geo.ll[0] : null, // Extract latitude
          longitude: geo?.ll ? geo.ll[1] : null, // Extract longitude
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
