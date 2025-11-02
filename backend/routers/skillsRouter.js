import express from "express";
import {
  getSkillsData,
  updateSkillsData,
} from "../controllers/skillsController.js";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSkillsData);

router.put("/", protectedMiddleware, adminMiddleware, updateSkillsData);

export default router;
