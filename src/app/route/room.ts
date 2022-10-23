import { Router } from "express";
import RoomController from "../controllers/RoomController";
import s3 from "..//..//infrastructure/s3";
const router = Router();
router.get("/users/:userId", RoomController.getPrivateRoomByUser);
router.get("/", RoomController.getMyRooms);
router.post("/", s3.single("avatar"), RoomController.createGroupRoomByUser);
router.get("/search", RoomController.searchRoom);
router.get("/:roomId/messages", RoomController.getMesageByGroup);
router.put("/:roomId/users/:userId", RoomController.addUserIntoRoom);
router.delete("/:roomId/users/:userId", RoomController.removeUserFromRoom);
router.put(
  "/:roomId",
  s3.single("avatar"),
  RoomController.createGroupRoomByUser
);

export default router;
