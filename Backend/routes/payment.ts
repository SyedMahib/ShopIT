import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { confirmPayment, createCheckoutSession } from "../controllers/paymentControllers.js";

// The webhook route lives in app.ts: it needs the raw body, before express.json() runs

const router = express.Router();

router.route("/payment/checkout/:orderId").post(isAuthenticatedUser, createCheckoutSession);
router.route("/payment/confirm/:orderId").post(isAuthenticatedUser, confirmPayment);

export default router;
