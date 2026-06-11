import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fetch from "node-fetch";

dotenv.config();

/**
 * Verify email using ZeroBounce
 */
export async function verifyEmail(email) {
  const url = `https://api.zerobounce.net/v2/validate?api_key=${process.env.ZEROBOUNCE_API_KEY}&email=${encodeURIComponent(
    email
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (
      data.status === "invalid" &&
      data.sub_status === "mailbox_not_found"
    ) {
      console.log(`Invalid email: ${email}`);
      return false;
    }

    if (data.status === "valid") {
      console.log(`Valid email: ${email}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Email verification error:", error);
    return false;
  }
}

/**
 * Send email using Mailtrap SMTP
 */
export async function sendEmail(to, subject, html) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.SECURE === "true",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"EventSync" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email not sent");
  }
}
