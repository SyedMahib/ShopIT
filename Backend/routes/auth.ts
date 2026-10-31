import express from "express";
import passport from "passport";
import {
  allUsers,
  deleteUser,
  forgotPassword,
  getUserDetails,
  getUserProfile,
  googleAuthCallback,
  googleLogin,
  loginUser,
  logOutUser,
  removeAvatar,
  registerUser,
  resetPassword,
  updatePassword,
  updateAvatar,
  updateProfile,
  updateUser,
} from "../controllers/authControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import { uploadAvatarImage } from "../middlewares/upload.js";
import { authLimiter, emailLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.route("/register").post(authLimiter, registerUser);
router.route("/login").post(authLimiter, loginUser);
router.route("/logout").get(logOutUser);

// Google OAuth routes
// session: false - the JWT cookie set in googleAuthCallback keeps the user signed in
router
  .route("/auth/google")
  .get(googleLogin, passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.route("/auth/google/callback").get(
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  googleAuthCallback
);

router.route("/password/forgot").post(emailLimiter, forgotPassword);
router.route("/password/reset/:token").put(authLimiter, resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router
  .route("/me/avatar")
  .put(isAuthenticatedUser, uploadAvatarImage, updateAvatar)
  .delete(isAuthenticatedUser, removeAvatar);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

export default router;
