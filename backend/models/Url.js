import mongoose from "mongoose";

// URL Schema
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Url", urlSchema);
