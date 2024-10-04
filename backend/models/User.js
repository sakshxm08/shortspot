import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  socials: [
    {
      platform: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
});

export default mongoose.model("User", userSchema);
