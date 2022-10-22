import { Router } from "express";
import RoomController from "../controllers/RoomController";
const router = Router();
router.get("/users/:userId", RoomController.getPrivateRoomByUser);
router.get("/", RoomController.getMyRooms);
router.post("/", RoomController.createGroupRoomByUser);
router.get("/search", RoomController.searchRoom);
router.get("/:roomId/messages", RoomController.getMesageByGroup);
router.put("/:roomId/users/:userId", RoomController.addUserIntoRoom);

export default router;
