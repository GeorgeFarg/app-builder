import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

/**
 * Generate JWT token for a user
 * @param userId - user's ID
 * @returns JWT token string
 */
export const generateToken = (userId: number): string => {
  const token = jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as any
  );

  return token;
};

/**
 * Decode JWT token and return userId
 * @param token - JWT token string
 * @returns userId from token
 */
export const decodeToken = (token: string): number => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch (err) {
    throw new Error("Invalid token");
  }
};
