// src/server.ts
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import userRouter from "./routes/userRouter";
import { errorHandler } from "./middleware/errorMiddleware";
import { protect, AuthenticatedRequest } from "./middleware/authMiddleware";
import { prisma } from "./config/prisma"; // ✅ استخدم نفس الـ prisma instance
import cookieParser from "cookie-parser";

dotenv.config();

console.log("🔹 Testing .env variables...");
console.log("PORT:", process.env.PORT);
console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "✅ exists" : "❌ missing"
);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ exists" : "❌ missing");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// ✅ Enable CORS before routes
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // allow cookies
  })
);

app.get("/", (_, res) => {
  res.send("Application is running");
});

// ---------------- Routes ----------------
app.use("/api/auth", userRouter);

// Example route: Get all users
app.get(
  "/users",
  protect,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

app.use("/api/projects");

// ---------------- Error handler ----------------
app.use(errorHandler);

// ---------------- Start server ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
