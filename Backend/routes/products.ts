import express from "express";
import {
  createProductReview,
  deleteProduct,
  adminProducts,
  deleteUnusedImage,
  uploadProductImages,
  canUserReview,
  deleteProductReviews,
  getProductDetails,
  getProductReviews,
  getProducts,
  newProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import { uploadProductImages as parseImages } from "../middlewares/upload.js";

const router = express.Router();

router.route("/products").get(getProducts);
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), adminProducts)
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

router
  .route("/admin/products/images")
  .post(isAuthenticatedUser, authorizeRoles("admin"), parseImages, uploadProductImages);
router
  .route("/admin/products/images/delete")
  .post(isAuthenticatedUser, authorizeRoles("admin"), deleteUnusedImage);

router.route("/products/:id").get(getProductDetails);
router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/reviews")
  .put(isAuthenticatedUser, createProductReview)
  .get(getProductReviews);

router.route("/can_review").get(isAuthenticatedUser, canUserReview);

router
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProductReviews);
export default router;
