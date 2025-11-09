import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // علشان نقرأ القيم من ملف .env

// إعداد الإرسال باستخدام Gmail
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// دالة إرسال OTP
export const sendOTPEmail = async (
  to: string,
  otp: string,
  purpose?: "registration" | "OTP" | "reset-password"
) => {
  const mailOptions = {
    from: `"Mosamem.AI" <${process.env.EMAIL_USER}>`,
    to,
    subject:
      purpose === "registration"
        ? "Mosamem.AI Registration OTP"
        : purpose === "reset-password"
        ? "Mosamem.AI Password Reset OTP"
        : "Mosamem.AI OTP Code",
    text:
      purpose === "registration"
        ? `Hello, your registration OTP for Mosamem.AI is: ${otp}`
        : purpose === "reset-password"
        ? `Your password reset OTP for Mosamem.AI is: ${otp}`
        : `Hello, your OTP for Mosamem.AI is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

