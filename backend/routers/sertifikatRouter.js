import express from "express";
import {
  getSertifikat,
  addSertifikat,
  updateSertifikat,
  deleteSertifikat,
} from "../controllers/sertifikatController.js";
import upload from "../utils/upload.js"; //
import {
  protectedMiddleware,
  adminMiddleware,
} from "../Middleware/authMiddleware.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 }, 
  { name: "mainFile", maxCount: 1 }, 
]);

router.get("/", getSertifikat);

router.post(
  "/",
  protectedMiddleware,
  adminMiddleware,
  uploadFields,
  addSertifikat
);

router.put(
  "/:id",
  protectedMiddleware,
  adminMiddleware,
  uploadFields,
  updateSertifikat
);

router.delete("/:id", protectedMiddleware, adminMiddleware, deleteSertifikat);

export default router;
