import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
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
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
};

const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
export default { register, login, verifyToken };
