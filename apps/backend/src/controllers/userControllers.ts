// src/controllers/userController.ts
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { sendOTPEmail } from "../utils/sendEmail";
import { generateToken } from "../utils/generateToken"; 
import { AuthenticatedRequest } from "../middleware/authMiddleware";
// ---------------- Signup ----------------
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {

      if (!existingUser.isVerified) {

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const newOtpExpires = new Date(Date.now() + 10 * 60 * 1000); 

        await prisma.user.update({
          where: { email },
          data: { otp: newOtp, otpExpires: newOtpExpires },
        });

        await sendOTPEmail(email, newOtp, "registration");

        return res.status(200).json({
          message: "This email is already registered but not verified. A new OTP has been sent.",
        });
      }

      return res.status(400).json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, isVerified: false, otp, otpExpires },
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
export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
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
export const resendOTP = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({ where: { email }, data: { otp, otpExpires } });
    await sendOTPEmail(email, otp, "registration");

    return res.json({ message: "A new OTP has been sent to your email " });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Login ----------------
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.password) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.isVerified) return res.status(400).json({ error: "Email not verified" });

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
// ---------------- Forgot Password ----------------
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({ where: { email }, data: { resetPasswordToken: otp, resetPasswordExpires } });
    await sendOTPEmail(email, otp, "reset-password");

    return res.json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Reset Password ----------------
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });
    if (user.resetPasswordToken !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (user.resetPasswordExpires && user.resetPasswordExpires.getTime() < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
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
// ---------------- Delete Account ----------------
export const deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    // req.user is provided by protect middleware
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // TODO: consider soft-delete or cascade delete of related data
    await prisma.user.delete({ where: { id: user.id } });

    // simple audit log
    console.log(`Account deleted: userId=${user.id}, email=${user.email}, time=${new Date().toISOString()}`);

    res.clearCookie("token");
    res.clearCookie("google_seen");
    res.clearCookie("github_seen");

    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};