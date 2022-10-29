import { Router } from "express";
import StorageController from "../controllers/StorageController";
import cloudinaryUpload from "..//..//infrastructure/cloudinary";
const router = Router();
router.post(
  "/upload",
  cloudinaryUpload.single("file"),
  StorageController.uploadSingleFile
);
export default router;
