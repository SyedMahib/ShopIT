import express from "express";
import { sendContactMessage } from "../controllers/contactControllers.js";
import { emailLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.route("/contact").post(emailLimiter, sendContactMessage);

export default router;
