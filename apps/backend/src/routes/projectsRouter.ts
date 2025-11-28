import { Router } from "express";
import { body, param } from "express-validator";
import { protect, AuthenticatedRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import { checkProjectOwnership } from "../middleware/ProjectMiddleware";
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "../controllers/projectController";

const router: Router = Router();
// Create Project
router.post(
  "/",
  protect,
  [
    body("name").trim().notEmpty().withMessage("Project name is required"),
    body("frontend").notEmpty().withMessage("Frontend is required"),
    body("backend").notEmpty().withMessage("Backend is required"),
  ],
  createProject
);

// Get all projects for authenticated user
router.get("/", protect, getAllProjects);

// Get a specific project by ID
router.get(
  "/:id",
  protect,
  [param("id").isInt().withMessage("Invalid project ID")],
  checkProjectOwnership,
  async (req: AuthenticatedRequest, res: Response) => {
    // Project already loaded in checkProjectOwnership
    res.json((req as any).project);
  }
);

// Update a project by ID
router.put(
  "/:id",
  protect,
  [
    param("id").isInt().withMessage("Invalid project ID"),
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("frontend").optional(),
    body("backend").optional(),
  ],
  checkProjectOwnership,
  updateProject
);

// Delete a project by ID
router.delete(
  "/:id",
  protect,
  [param("id").isInt().withMessage("Invalid project ID")],
  checkProjectOwnership,
  deleteProject
);

export default router;
