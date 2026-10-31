import rateLimit from "express-rate-limit";

const limited = (message: string) => ({ message });

// Login, register and password reset: slows down password guessing.
// Successful requests don't count, so normal users never hit it.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: limited("Too many attempts, please try again in 15 minutes"),
});

// Endpoints that send an email (forgot password, contact form): stops inbox flooding
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: limited("Too many requests, please try again in an hour"),
});
