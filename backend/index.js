import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import urlRoutes from "./routes/url.js";
import userRoutes from "./routes/user.js";
import redirectRoutes from "./routes/redirect.js";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5174", "http://localhost:5173"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/urls", urlRoutes);
app.use("/api/auth", userRoutes);
app.use("/", redirectRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}\nConnected to DB`)
    )
  )
  .catch((err) => console.error("Could not connect to MongoDB", err));
