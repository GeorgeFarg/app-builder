// src/server.ts
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter";
import oauthRouter from "./routes/oauthRouter";
import { errorHandler } from "./middleware/errorMiddleware";
import passport from "./config/passport";
import projectRouter from "./routes/projectsRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log("🔹 Testing .env variables...");
console.log("PORT:", process.env.PORT);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ exists" : "❌ missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ exists" : "❌ missing");

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// initialize passport (no sessions)
app.use(passport.initialize());

app.get("/", (_, res) => {
  res.send("Application is running");
});

// Auth APIs (email/password)
app.use("/api/auth", userRouter);

// OAuth routes
app.use("/api/auth", oauthRouter);


app.use("/api/projects", projectRouter);

// ---------------- Error handler ----------------
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
