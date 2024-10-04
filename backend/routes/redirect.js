import { Router } from "express";
import urlController from "../controllers/url.js";

const { redirectToOriginalUrl } = urlController;

const router = Router();

router.get(
  "/:username/:platform",
  (req, res, next) => {
    req.isPlatform = true;
    next();
  },
  redirectToOriginalUrl
);
router.get("/:shortUrl", redirectToOriginalUrl);

export default router;
