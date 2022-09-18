import { Router } from "express";
import RoomRepository from "../../infrastructure/dynamoDB/repository/RoomRepository";
import UserController from "../controllers/UserController";
import { IRoom } from "../entities/Room";
const router = Router();
router.get("/", async (req, res, next) => {
  //   const room: IRoom = {
  //     users: [
  //       { id: "8ee1f028-25d5-4a0f-a8fa-39a0765dd142", lastMessageRead: "" },
  //       { id: "6b88f37c-b177-479a-a309-1e5ab75c02f8", lastMessageRead: "" },
  //     ],
  //     message: [],
  //   };
  //   await RoomRepository.addOrUpdateOne(room);
  const room = await RoomRepository.getRoomByUser(
    "8ee1f028-25d5-4a0f-a8fa-39a0765dd142"
  );
  res.json(room);
});

export default router;
