import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import { prisma } from "../config/prisma";

// Middleware to check if project belongs to user
export const checkProjectOwnership = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const projectId = Number(req.params.id);
  if (!projectId) return res.status(400).json({ error: "Invalid project ID" });
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    (req as any).project = project; // Attach to req for update/delete if needed
    next();
  } catch (error) {
    next(error);
  }
};
