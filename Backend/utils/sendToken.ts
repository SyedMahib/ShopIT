import { Response } from "express";
import { IUser } from "../models/user.js";

export default (user: IUser, statusCode: number, res: Response): void => {
  // Create JWT token
  const token = user.getJwtToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};