import express from "express";
import {
  getSkillsData,
  updateSkillsData,
} from "../controllers/skillsController.js";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSkillsData);

router.put("/", protectedMiddleware, adminMiddleware, updateSkillsData);

export default router;
