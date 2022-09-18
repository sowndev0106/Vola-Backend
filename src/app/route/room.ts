import { Router } from "express";
import RoomRepository from "../../infrastructure/dynamoDB/repository/RoomRepository";
import RoomController from "../controllers/RoomController";
const router = Router();
router.get("/users/:userId", RoomController.getPrivateRoomByUser);
router.get("/", RoomController.getMyRooms);

export default router;
