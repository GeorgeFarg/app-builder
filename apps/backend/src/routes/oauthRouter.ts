// src/routes/oauthRouter.ts
import { Router, Request, Response, NextFunction } from "express";
import passport from "../config/passport";
import { prisma } from "../config/prisma";

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

/**
 * Cookie options helper
 * @param maxAge - cookie max age in milliseconds
 * @returns cookie options object
 */
const cookieOptions = (maxAge = 30 * 24 * 60 * 60 * 1000) => {
  const sameSite: "none" | "lax" = process.env.NODE_ENV === "production" ? "none" : "lax";
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite,
    path: "/",
    maxAge,
  };
};

/**
 * Handle OAuth redirect after successful login
 * Updates access token in database and sets cookies
 */
const handleOAuthRedirect = async (req: Request, res: Response) => {
  const payload = req.user as { user: any; token: string; accessToken?: string };
  if (!payload) return res.status(400).send("OAuth error");

  // Update accessToken in database if present
  if (payload.accessToken) {
    const updateData: any = {};
    if (payload.user.provider === "google") updateData.googleAccessToken = payload.accessToken;
    if (payload.user.provider === "github") updateData.githubAccessToken = payload.accessToken;

    await prisma.user.update({
      where: { id: payload.user.id },
      data: updateData,
    });
  }

  // Set auth token cookie
  res.cookie("token", payload.token, cookieOptions());

  // Set provider_seen cookie to remember login
  res.cookie(
    `${payload.user.provider}_seen`,
    "1",
    cookieOptions(365 * 24 * 60 * 60 * 1000)
  );

  // Redirect to frontend profile page
  return res.redirect(`${FRONTEND_URL}/profile`);
};

/* ---------------- Google OAuth ---------------- */
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const seen = req.cookies?.google_seen === "1";
  const options: any = { scope: ["profile", "email"], session: false };
  if (!seen || req.query.force_select === "1") options.prompt = "consent";
  passport.authenticate("google", options)(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failWithError: true }),
  handleOAuthRedirect
);

/* ---------------- GitHub OAuth ---------------- */
router.get("/github", (req: Request, res: Response, next: NextFunction) => {
  const seen = req.cookies?.github_seen === "1";
  const options: any = { scope: ["user:email"], session: false };
  if (!seen || req.query.force_select === "1") options.prompt = "consent";
  passport.authenticate("github", options)(req, res, next);
});

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failWithError: true }),
  handleOAuthRedirect
);

export default router;
