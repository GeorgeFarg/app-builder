import jwt from "jsonwebtoken";

export const generateToken = (userId: number): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  // توليد التوكن
  const token = jwt.sign(
    { id: userId },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "30d" } as any
  );

  return token;
};
