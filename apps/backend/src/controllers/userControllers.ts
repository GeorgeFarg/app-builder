// src/controllers/userController.ts
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { sendOTPEmail } from "../utils/sendEmail";
import { generateRefreshToken, generateToken } from "../utils/generateToken";
// ---------------- Signup ----------------
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, confirmPassword } = req.body;
  console.log("Register request body:", req.body);

  // ✅ تحقق من تطابق الباسورد مع confirmPassword
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    // ✅ لو المستخدم موجود
    if (existingUser) {
      // 🔹 لو الحساب غير مفعل
      if (!existingUser.isVerified) {
        // أنشئ OTP جديد وحدثه في قاعدة البيانات
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const newOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق صلاحية

        await prisma.user.update({
          where: { email },
          data: { otp: newOtp, otpExpires: newOtpExpires },
        });

        // ابعت الكود الجديد
        await sendOTPEmail(email, newOtp, "registration");

        return res.status(200).json({
          message:
            "This email is already registered but not verified. A new OTP has been sent.",
        });
      }

      // 🔹 لو الحساب مفعل فعلًا
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // ✅ لو المستخدم جديد (غير موجود)
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        otp,
        otpExpires,
      },
    });

    await sendOTPEmail(email, otp, "registration");

    return res.status(201).json({
      message: "User registered successfully. OTP sent to email.",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Verify Email ----------------
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, otp } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (user.otpExpires && user.otpExpires.getTime() < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpires: null },
    });

    return res.json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Resend OTP ----------------
export const resendOTP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({ where: { email }, data: { otp, otpExpires } });
    await sendOTPEmail(email, otp, "registration");

    return res.json({ message: "A new OTP has been sent to your email ✅" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Login ----------------
export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Email is not verified",
        redirect: "/auth/verify",
      });
    }

    // Generate access token and refresh token
    const accessToken = generateToken(user.id);
    // You need to implement generateRefreshToken
    const refreshToken = generateRefreshToken(user.id);

    // Set tokens in HttpOnly Cookies
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({
      message: "Login successful",
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
// ---------------- Forgot Password ----------------
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { resetPasswordToken: otp, resetPasswordExpires },
    });
    await sendOTPEmail(email, otp, "reset-password");

    return res.json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Reset Password ----------------
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });
    if (user.resetPasswordToken !== otp)
      return res.status(400).json({ error: "Invalid OTP" });
    if (
      user.resetPasswordExpires &&
      user.resetPasswordExpires.getTime() < Date.now()
    )
      return res.status(400).json({ error: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Log Out ----------------
export const logoutUser = (req: Request, res: Response): Response => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
};
