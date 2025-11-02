import express from "express";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import upload from "../utils/upload.js"; 
import {
  protectedMiddleware,
  adminMiddleware,
} from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProjects);

router.post(
  "/",
  protectedMiddleware,
  adminMiddleware,
  upload.single("thumbnail"), 
  addProject
);

router.put(
  "/:id",
  protectedMiddleware,
  adminMiddleware,
  upload.single("thumbnail"),
  updateProject
);

router.delete("/:id", protectedMiddleware, adminMiddleware, deleteProject);

export default router;
