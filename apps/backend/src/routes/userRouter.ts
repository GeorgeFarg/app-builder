// src/routes/userRouter.ts
import { Router } from "express";
import { body } from "express-validator";
import {
  registerUser,
  verifyEmail,
  loginUser,
  resendOTP,
  forgotPassword,
  resetPassword,
  logoutUser,
} from "../controllers/userControllers";
import { AuthenticatedRequest, protect } from "../middleware/authMiddleware";

const router: Router = Router();

// ---------------- Signup ----------------
router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

// ---------------- Verify OTP ----------------
router.post(
  "/verify-email",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  verifyEmail
);

// ---------------- Resend OTP ----------------
router.post("/resend-otp", resendOTP);

// ---------------- Login ----------------
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  loginUser
);

// ---------------- Forgot Password ----------------
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please include a valid email")],
  forgotPassword
);

// ---------------- Reset Password ----------------
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  resetPassword
);

// ---------------- Profile (Verify Token) ----------------
router.get("/profile", protect, async (req: AuthenticatedRequest, res) => {
  res.json({
    message: "Token is valid ✅",
    user: req.user,
  });
});

// ---------------- Log Out ----------------
router.post("/logout", logoutUser);

export default router;
