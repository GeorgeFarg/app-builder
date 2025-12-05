import { prisma } from "../config/prisma";

interface OAuthUser {
  provider: string;
  providerId: string;
  email?: string;
  name?: string;
  avatar?: string;
  accessToken?: string; // OAuth access token (Google or GitHub)
}

export const findOrCreateOAuthUser = async ({
  provider,
  providerId,
  email,
  name,
  avatar,
  accessToken,
}: OAuthUser) => {

  //  Try to find user by provider and providerId
  let user = await prisma.user.findFirst({
    where: { provider, providerId },
  });

  //  If not found, check if a user exists with the same email
  if (!user) {
    if (email) {
      const existingEmailUser = await prisma.user.findUnique({
        where: { email },
      });

      //  If user exists by email, update it with provider info and token
      if (existingEmailUser) {
        user = await prisma.user.update({
          where: { email },
          data: {
            provider,
            providerId,
            avatar,
            // Add Google access token if provider is Google
            ...(provider === "google" ? { googleAccessToken: accessToken } : {}),
            // Add GitHub access token if provider is GitHub
            ...(provider === "github" ? { githubAccessToken: accessToken } : {}),
          },
        });
      }
    }
  }

  //  If still not found, create a new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        // Use provider+id as email if email is not provided
        email: email || `${provider}-${providerId}@no-email.local`,
        name: name || "Unknown",
        avatar: avatar || "",
        provider,
        providerId,
        // Store access token for Google or GitHub
        ...(provider === "google" ? { googleAccessToken: accessToken } : {}),
        ...(provider === "github" ? { githubAccessToken: accessToken } : {}),
        isVerified: true, // Mark OAuth users as verified by default
      },
    });
  }

  //  Return the found or newly created user
  return user;
};
