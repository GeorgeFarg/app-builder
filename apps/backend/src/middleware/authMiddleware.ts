// src/middleware/authMiddleware.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

// ✅ Export this interface
export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // ✅ السماح بقراءة التوكن من الـ Header أو الـ Cookie
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({ error: "Not authorized, no token" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, isVerified: true },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Not authorized, token failed" });
  }
};
