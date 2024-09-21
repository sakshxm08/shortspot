require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const shortid = require("shortid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const corsOptions = {
  origin: ["http://localhost:5174", "http://localhost:5173"],
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// URL Schema
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Url = mongoose.model("Url", urlSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified._id;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Routes
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});

app.get("/api/verify-token", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// Shorten URL
app.post("/api/shorten", verifyToken, async (req, res) => {
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
});

app.get("/api/dashboard", verifyToken, async (req, res) => {
  try {
    const urls = await Url.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: "Error fetching URLs" });
  }
});

app.get("/:shortUrl", async (req, res) => {
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
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
