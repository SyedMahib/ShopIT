import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistControllers.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/wishlist").get(isAuthenticatedUser, getWishlist);
router.route("/wishlist/add").post(isAuthenticatedUser, addToWishlist);
router
  .route("/wishlist/remove/:productId")
  .delete(isAuthenticatedUser, removeFromWishlist);

export default router;
