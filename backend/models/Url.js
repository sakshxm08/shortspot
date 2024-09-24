import mongoose from "mongoose";

// URL Schema
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  analytics: [
    {
      timestamp: { type: Date, default: Date.now },
      ip: String,
      userAgent: String,
      referrer: String,
      location: {
        country: String,
        city: String,
      },
      deviceType: String,
      os: String,
      browser: String,
      language: String,
    },
  ],
});

export default mongoose.model("Url", urlSchema);
