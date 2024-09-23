import { Router } from "express";
import userController from "../controllers/user.js";
import verifyTokenMiddleware from "../middlewares/verifyToken.js";
const { register, login, verifyToken } = userController;

const router = Router();

// Routes
router.post("/register", register);
router.post("/login", login);
router.get("/verify-token", verifyTokenMiddleware, verifyToken);

export default router;
