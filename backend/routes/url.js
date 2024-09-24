import { Router } from "express";
import urlController from "../controllers/url.js";
import verifyToken from "../middlewares/verifyToken.js";

const { shortenUrl, getUrls, deleteUrl, updateUrl, getURL } = urlController;

const router = Router();

// Shorten URL
router.post("/shorten", verifyToken, shortenUrl);

router.get("/", verifyToken, getUrls);

router.get("/:shortUrl", verifyToken, getURL);

router.delete("/:id", verifyToken, deleteUrl);

router.put("/:id", verifyToken, updateUrl);

export default router;
