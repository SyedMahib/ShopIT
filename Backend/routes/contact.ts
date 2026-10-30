import express from "express";
import { sendContactMessage } from "../controllers/contactControllers.js";

const router = express.Router();

router.route("/contact").post(sendContactMessage);

export default router;
