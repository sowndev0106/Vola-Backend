import { Router } from "express";
import StorageController from "../controllers/StorageController";
import s3 from "..//..//infrastructure/s3";
const router = Router();
router.get("/upload", s3.single("file"), StorageController.uploadSingleFile);
export default router;
