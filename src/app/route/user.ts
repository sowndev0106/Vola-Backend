import { Router } from "express";
import UserController from "../controllers/UserController";
const router = Router();
router.get("/profile", UserController.getMyProfile);
router.post("/invites", UserController.sendFriendInvite);
router.get("/email/:email", UserController.getUserByEmail);
router.get("/:id", UserController.getUserById);
export default router;
