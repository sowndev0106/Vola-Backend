import { Router } from "express";
import UserController from "../controllers/UserController";
const router = Router();
router.get("/profile", UserController.getMyProfile);
router.get("/email/:email", UserController.getUserByEmail);

export default router;
