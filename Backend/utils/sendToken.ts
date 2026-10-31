import { CookieOptions, Response } from "express";
import { IUser } from "../models/user.js";

// Settings for the JWT cookie, shared by every place that sets or clears it.
// secure: only sent over HTTPS in production. sameSite lax: not sent with
// requests from other sites, except when following a link to the shop.
export const tokenCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

export const setTokenCookie = (user: IUser, res: Response): void => {
  res.cookie("token", user.getJwtToken(), {
    ...tokenCookieOptions(),
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
  });
};

export default (user: IUser, statusCode: number, res: Response): void => {
  // The token stays in the httpOnly cookie only, out of reach of page scripts
  setTokenCookie(user, res);

  res.status(statusCode).json({
    success: true,
  });
};
