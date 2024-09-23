import { Router } from "express";
import urlController from "../controllers/url.js";
import verifyToken from "../middlewares/verifyToken.js";

const { shortenUrl, getUrls } = urlController;

const router = Router();

// Shorten URL
router.post("/shorten", verifyToken, shortenUrl);

router.get("/", verifyToken, getUrls);

export default router;
