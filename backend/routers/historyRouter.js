import express from "express";
import {
  getHistoryItems,
  addHistoryItem,
  updateHistoryItem,
  deleteHistoryItem,
} from "../controllers/historyController.js";
import upload from "../utils/upload.js"; 
import {
  protectedMiddleware,
  adminMiddleware,
} from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getHistoryItems);

router.post(
  "/",
  protectedMiddleware,
  adminMiddleware,
  upload.single("logoFile"), 
  addHistoryItem
);

router.put(
  "/:id",
  protectedMiddleware,
  adminMiddleware,
  upload.single("logoFile"), 
  updateHistoryItem
);

router.delete("/:id", protectedMiddleware, adminMiddleware, deleteHistoryItem);

export default router;
