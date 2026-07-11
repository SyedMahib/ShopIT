import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

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

    if (!email || !password) {
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
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })

    res.status(200).json({
      message: "Logged Out",
    })
  })


  // Forgot Password => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    // Finding user in database
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler("User not found with this email", 404));
    }

    //  Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save()

    // create reset password url

    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user.name, resetUrl);

    try {
      await sendEmail({
        email: user.email,
        subject: "ShopIT Password Recovery",
        message,
      })

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`
      })
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