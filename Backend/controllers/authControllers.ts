import { NextFunction, Request, Response } from "express";
import { deleteImages, uploadAvatar } from "../utils/cloudinary.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken, { setTokenCookie, tokenCookieOptions } from "../utils/sendToken.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// Google Login Controller
export const googleLogin = (req: Request, res: Response, next: NextFunction) => {
  // Passport handles the authentication via redirect
  next();
};

// Google Auth Callback Controller
export const googleAuthCallback = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as any;

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Set JWT cookie manually so we can redirect after
    setTokenCookie(user, res);

    // Redirect to frontend — the app will fetch /api/v1/me on mount
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  }
);

// Register a User => /api/v1/register
export const registerUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    sendToken(user, 201, res);
  }
);

// Login a User => /api/v1/login
export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    // Strings only: an object like { "$ne": null } would otherwise match any user
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    //  check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  }
);


// LogOut a User => /api/v1/logout
export const logOutUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.clearCookie("token", tokenCookieOptions());

    res.status(200).json({
      message: "Logged Out",
    })
  })


  // Forgot Password => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    // Finding user in database
    const user = await User.findOne({ email: String(req.body.email ?? "") });

    // Same reply whether or not the account exists, so this endpoint
    // can't be used to find out which emails are registered
    const genericReply = {
      success: true,
      message: "If an account exists for that email, a reset link has been sent",
    };

    if (!user) {
      res.status(200).json(genericReply);
      return;
    }

    //  Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save()

    // create reset password url

    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user.name, resetUrl);

    try {
      await sendEmail({
        email: user.email,
        subject: "ShopIT Password Recovery",
        message,
      })

      res.status(200).json(genericReply)
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      return next(new ErrorHandler((error as Error)?.message, 500));
    }
  }
);


 // Reset Password => /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    // Hash the URL token
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token as string)
    .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return next (new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password and confirm password do not match", 400));
    }

    // Set new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  })

  // Get Current user profile => /api/v1/me

  export const getUserProfile = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const user = await User.findById((req.user as any)?._id);

      res.status(200).json({
        user,
      })
    }
  )

   // Update password => /api/v1/password/update

  export const updatePassword = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const user = await User.findById((req.user as any)?._id).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Accounts created with Google sign-in have no password yet
      if (!user.password) {
        return next(new ErrorHandler("Your account uses Google sign-in. Use 'Forgot password' on the login page to set a password.", 400));
      }

      // check the previous password
      const isPasswordMatched = await user.comparePassword(String(req.body.oldPassword ?? ""));

      if(!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
      }

      const newPassword = String(req.body.newPassword ?? "");

      // Validate password length before saving
      if (newPassword.length < 6) {
        return next(new ErrorHandler("Password must be at least 6 characters long", 400));
      }

      user.password = newPassword;
      await user.save({ validateModifiedOnly: true });

      res.status(200).json({
        success: true,
      })
    }
  )

     // Update User Profile => /api/v1/password/update

  export const updateProfile = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     
      const newUserData: { name?: string; email?: string } = {};
      if (req.body.name !== undefined) newUserData.name = req.body.name;
      if (req.body.email !== undefined) newUserData.email = req.body.email;

      const user = await User.findByIdAndUpdate((req.user as any)?._id, newUserData, {
        returnDocument: "after",
        runValidators: true,
      })

      res.status(200).json({
        user
      })
    }
  )

  // Upload/replace profile picture => /api/v1/me/avatar (PUT)
  export const updateAvatar = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const file = (req.files as Express.Multer.File[] | undefined)?.[0];

      if (!file) {
        return next(new ErrorHandler("Please choose an image", 400));
      }

      const user = await User.findById((req.user as any)?._id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const oldPublicId = user.avatar?.public_id;
      user.avatar = await uploadAvatar(file.buffer);
      await user.save({ validateModifiedOnly: true });
      await deleteImages([oldPublicId]);

      res.status(200).json({
        user
      })
    }
  )

  // Remove profile picture => /api/v1/me/avatar (DELETE)
  export const removeAvatar = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const user = await User.findById((req.user as any)?._id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const oldPublicId = user.avatar?.public_id;
      user.avatar = undefined;
      await user.save({ validateModifiedOnly: true });
      await deleteImages([oldPublicId]);

      res.status(200).json({
        user
      })
    }
  )

      // Get All Users - Admin => /api/v1/admin/users

  export const allUsers = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     
      const users = await User.find().sort({ createdAt: -1 });

      res.status(200).json({
        users,
      })
    }
  )

  // Get Users details - Admin => /api/v1/admin/users/:id

  export const getUserDetails = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     
      const user = await User.findById(req.params.id);

      if(!user){
        return next(new ErrorHandler(`User not found with the id: ${req.params.id}`, 404))
      }

      res.status(200).json({
        user,
      })
    }
  )

    // Update User Details - Admin => /api/v1/admin/users/:id

  export const updateUser = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     
      const newUserData: { name?: string; email?: string; role?: string } = {};
      if (req.body.name !== undefined) newUserData.name = req.body.name;
      if (req.body.email !== undefined) newUserData.email = req.body.email;
      if (req.body.role !== undefined) {
        if (!["user", "admin"].includes(req.body.role)) {
          return next(new ErrorHandler("Role must be user or admin", 400))
        }
        if (req.params.id === String((req.user as any)?._id) && req.body.role !== "admin") {
          return next(new ErrorHandler("You can't remove your own admin role", 400))
        }
        newUserData.role = req.body.role;
      }

      const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        returnDocument: "after",
        runValidators: true,
      })

      if(!user){
        return next(new ErrorHandler(`User not found with the id: ${req.params.id}`, 404))
      }

      res.status(200).json({
        user
      })
    }
  )


  // Delete User - Admin => /api/v1/admin/users/:id

  export const deleteUser = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     
      const user = await User.findById(req.params.id);

      if(!user){
        return next(new ErrorHandler(`User not found with the id: ${req.params.id}`, 404))
      }

      if (String(user._id) === String((req.user as any)?._id)) {
        return next(new ErrorHandler("You can't delete your own account", 400))
      }

      await user.deleteOne();
      await deleteImages([user.avatar?.public_id]);

      res.status(200).json({
        success: true,
      })
    }
  )