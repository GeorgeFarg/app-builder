import { Request, Response, NextFunction } from "express";

// Custom error handler middleware
export const errorHandler = (
  err: any, // أي نوع لأن بعض الأخطاء ممكن تكون غير Error object
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
