import Url from "../models/Url.js";
import shortid from "shortid";

const shortenUrl = async (req, res) => {
  const { originalUrl, customUrl, useCustomUrl } = req.body;
  let shortUrl;

  if (useCustomUrl && customUrl) {
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
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortUrl}` });
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
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: "No URL found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
export default { shortenUrl, getUrls, redirectToOriginalUrl };
