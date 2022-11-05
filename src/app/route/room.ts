import { Router } from "express";
import RoomController from "../controllers/RoomController";
import cloudinary from "..//..//infrastructure/cloudinary";

const router = Router();

router.get("/users/:userId", RoomController.getPrivateRoomByUser);

router.get("/", RoomController.getMyRooms);

router.post(
  "/",
  cloudinary.single("avatar"),
  RoomController.createGroupRoomByUser
);
router.get("/search", RoomController.searchRoom);

router.get("/:roomId/messages", RoomController.getMesageByGroup);

router.put("/:roomId/users", RoomController.addUserIntoRoom);

router.patch("/:roomId/name", RoomController.updateNameRoom);

router.patch(
  "/:roomId/avatar",
  cloudinary.single("avatar"),
  RoomController.updateAvatarRoom
);

router.delete("/:roomId/users/:userId", RoomController.removeUserFromRoom);

router.put(
  "/:roomId",
  cloudinary.single("avatar"),
  RoomController.createGroupRoomByUser
);

router.get("/:roomId", RoomController.getRoomById);
router.get(
  "/:roomId/user-vailable-add-room",
  RoomController.getListUserAvailableAddRoom
);
router.delete("/:roomId", RoomController.deleteRoom);

export default router;
