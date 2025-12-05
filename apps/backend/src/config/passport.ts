import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from "passport-github2";
import { prisma } from "../config/prisma";
import { User } from "@prisma/client";
import { generateToken } from "../utils/generateToken"; 

/**
 * Find an existing OAuth user or create a new one
 * @param data - Object containing provider info, email, name, avatar, and access token
 * @returns User instance from the database
 */
async function findOrCreateOAuthUser(data: {
  provider: string;
  providerId: string;
  email?: string | null;
  name?: string | null;
  avatar?: string | null;
  accessToken?: string | null; //  Access token for Google or GitHub
}) {
  const { provider, providerId, email: maybeEmail, name, avatar, accessToken } = data;
  const email = maybeEmail ?? `${provider}-${providerId}@no-email.local`;

  // Try to find a user with the given provider and providerId
  let user = await prisma.user.findFirst({
    where: { provider, providerId },
  });

  // If no user found by providerId, check if email exists
  if (!user) {
    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      // Update existing user with new provider info and access token
      user = await prisma.user.update({
        where: { email },
        data: {
          provider,
          providerId,
          avatar,
          ...(provider === "google" ? { googleAccessToken: accessToken } : {}),
          ...(provider === "github" ? { githubAccessToken: accessToken } : {}),
        },
      });
    }
  }

  // If user still not found, create a new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        provider,
        providerId,
        email,
        name: name ?? "Guest User",
        avatar,
        password: "", // No password for OAuth users
        isVerified: true, // OAuth users are automatically verified
        ...(provider === "google" ? { googleAccessToken: accessToken } : {}),
        ...(provider === "github" ? { githubAccessToken: accessToken } : {}),
      },
    });
  }

  return user;
}

/* ---------------- Google Strategy ---------------- */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        // Find or create the user in the database
        const user = await findOrCreateOAuthUser({
          provider: "google",
          providerId: profile.id,
          email,
          name: profile.displayName,
          avatar,
          accessToken: _accessToken, // Save Google access token
        });

        // Generate JWT token for frontend
        const token = generateToken(user.id);

        return done(null, { user, token });
      } catch (err) {
        return done(err);
      }
    }
  )
);

/* ---------------- GitHub Strategy ---------------- */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ["user:email"],
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: GitHubProfile,
      done: (err: any, user?: { user: User; token: string }) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value ?? null;
        const avatar = profile.photos?.[0]?.value ?? null;

        // Find or create the user in the database
        const user = await findOrCreateOAuthUser({
          provider: "github",
          providerId: profile.id,
          email,
          name: profile.username ?? profile.displayName ?? null,
          avatar,
          accessToken: _accessToken, // Save GitHub access token
        });

        // Generate JWT token for frontend
        const token = generateToken(user.id);

        return done(null, { user, token });
      } catch (err) {
        return done(err);
      }
    }
  )
);

export default passport;
