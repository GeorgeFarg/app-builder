import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../config/prisma";

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, frontend, backend } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        frontend,
        backend,
        userId: req.user.id,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, frontend, backend } = req.body;
  const projectId = Number(req.params.id);
  try {
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(typeof name !== "undefined" && { name }),
        ...(typeof frontend !== "undefined" && { frontend }),
        ...(typeof backend !== "undefined" && { backend }),
      },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const projectId = Number(req.params.id);
  try {
    await prisma.project.delete({ where: { id: projectId } });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};
