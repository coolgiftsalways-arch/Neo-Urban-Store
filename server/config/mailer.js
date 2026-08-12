import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("SMTP USER:", process.env.SMTP_USER);
console.log(
  "SMTP PASSWORD EXISTS:",
  !!process.env.SMTP_PASSWORD
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",

  port: Number(process.env.SMTP_PORT) || 465,

  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default transporter;