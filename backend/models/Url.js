import mongoose from "mongoose";

// URL Schema
const urlSchema = new mongoose.Schema(
  {
    originalUrl: String,
    shortUrl: String,
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
          latitude: { type: Number, default: null },
          longitude: { type: Number, default: null },
        },
        deviceType: String,
        os: String,
        browser: String,
        language: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Url", urlSchema);
