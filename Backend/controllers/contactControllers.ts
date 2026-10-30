import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Send a contact form message to the store inbox => /api/v1/contact
export const sendContactMessage = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const name = String(req.body.name ?? "").trim();
    const email = String(req.body.email ?? "").trim();
    const subject = String(req.body.subject ?? "").trim();
    const message = String(req.body.message ?? "").trim();

    if (!name || !email || !message) {
      return next(new ErrorHandler("Please fill in your name, email and message", 400));
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(new ErrorHandler("Please enter a valid email address", 400));
    }
    if (name.length > 100 || subject.length > 150 || message.length > 5000) {
      return next(new ErrorHandler("Your message is too long", 400));
    }

    const inbox = process.env.CONTACT_EMAIL || process.env.SMTP_FROM_EMAIL;
    if (!inbox) {
      return next(new ErrorHandler("Contact form is not configured", 500));
    }

    await sendEmail({
      email: inbox,
      // Keep the visitor's text out of the subject line structure
      subject: `Contact form: ${subject.replace(/[\r\n]+/g, " ") || "New message"}`,
      replyTo: email,
      message: `
        <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject || "(none)")}</p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    res.status(200).json({
      success: true,
    });
  },
);
