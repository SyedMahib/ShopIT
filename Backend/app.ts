import dotenv from "dotenv";
dotenv.config({ path: "Backend/config/config.env" });

import path from "path";
import express from "express";
import helmet from "helmet";
import passport from "passport";
import { connectDatabase } from "./config/dbConnect.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import wishlistRoutes from "./routes/wishlist.js";
import contactRoutes from "./routes/contact.js";
import paymentRoutes from "./routes/payment.js";
import { stripeWebhook } from "./controllers/paymentControllers.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import "./config/passport.config.js";
import User from "./models/user.js";
import ErrorHandler from "./utils/errorHandler.js";

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1)
})

if (!process.env.JWT_SECRET) {
  console.log("JWT_SECRET is not set in Backend/config/config.env");
  process.exit(1);
}

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Hosts like Render sit behind one HTTPS proxy: trust it for the client IP
// (rate limiting) and for knowing the request was HTTPS (secure cookies)
if (isProduction) app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // Product images can come from any https host the admin enters (Cloudinary, Unsplash...)
        "img-src": ["'self'", "data:", "https:"],
      },
    },
  }),
);

// Connect to database
connectDatabase();

// Stripe signs the raw request body, so the webhook must read it before express.json()
app.post("/api/v1/payment/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());


// Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", wishlistRoutes);
app.use("/api/v1", contactRoutes);
app.use("/api/v1", paymentRoutes);

// Health check for the host (and uptime monitors): answers without touching the database
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Proxy Google avatars (Google blocks direct cross-origin requests)
app.get("/api/avatar/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user?.avatar?.url) return res.status(404).send("No avatar");

    const response = await fetch(user.avatar.url, {
      headers: {
        Referer: "https://www.google.com/",
        "User-Agent": "Mozilla/5.0",
      },
    });
    const buffer = await response.arrayBuffer();
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send("Failed to fetch avatar");
  }
});


// Unknown API routes get a JSON error instead of the frontend page
app.use("/api", (req, res, next) => {
  next(new ErrorHandler(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

// In production the backend also serves the built frontend, so both share one domain
if (isProduction) {
  const frontendDist = path.resolve("Frontend/dist");
  app.use(express.static(frontendDist));
  // Every other non-API path is a page of the React app
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Using Error Middlewares

app.use(errorMiddleware);

const PORT = process.env.PORT as string;

const server = app.listen(PORT, () => {
  console.log(
    `Server is running on port: ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});

// Handle Unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error ${err}`);
  console.log("Shutting down servern due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
