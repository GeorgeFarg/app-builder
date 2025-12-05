import { decodeToken } from "../utils/generateToken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

// Extend Express Request type to include `user`
export interface AuthenticatedRequest extends Request {
  user?: any;// Will hold the authenticated user's data
}
//Middleware to protect routes and ensure the user is authenticated
export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    //Get token from Authorization header (Bearer token) or cookies
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    //If no token is found, return 401 Unauthorized
    if (!token) {
      res.status(401).json({ error: "Not authorized, no token" });
      return;
    }
    //Verify JWT token
    const userId = decodeToken(token); // this will throw if token is invalid
    
    // Find the user in the database using the decoded id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, isVerified: true, avatar: true  },
    });
    //If user not found, return 401 Unauthorized
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    //Attach user to request object and call next middleware
    req.user = user;
    next();
  } catch (error: any) {
    //Catch any errors (e.g., invalid token) and return 401
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Not authorized, token failed" });
  }
};