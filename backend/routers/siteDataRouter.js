import express from "express";
import {
  getSiteData,
  updateSiteData,
  uploadProfileImage,
  updateProfileImage,
  deleteProfileImage,
} from "../controllers/siteDataController.js";
import upload from "../utils/upload.js";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSiteData);

router.put("/", protectedMiddleware, adminMiddleware, updateSiteData);

router.post(
  "/upload-image",
  protectedMiddleware,
  adminMiddleware,
  upload.single("profileImage"),
  uploadProfileImage
);

router.put(
  "/update-image",
  protectedMiddleware,
  adminMiddleware,
  upload.single("profileImage"), 
  updateProfileImage
);

router.delete(
  "/delete-image",
  protectedMiddleware,
  adminMiddleware,
  deleteProfileImage
);

export default router;
