import { NextFunction, Request, Response } from "express";
import GetPrivateRoomByUserHandler from "../handlers/rooms/GetPrivateRoomByUserHandler";
import CreateGroupRoomHandler from "../handlers/rooms/CreateGroupRoomHandler";
import GetMyRoomsHandler from "../handlers/rooms/GetMyRoomsHandler";
import { IMessage } from "../entities/Room";
import GetMessagesHandler from "../handlers/rooms/GetMessagesHandler";
import AddUserIntoRoomHannler from "../handlers/rooms/AddUserIntoRoomHannler";
import SearchRoomHandler from "../handlers/rooms/SearchRoomHandler";
import { getLocationFromRequest } from "../../util/mutler";
import RemoveUserFromRoomHannler from "../handlers/rooms/RemoveUserFromRoomHannler";

class RoomController {
  // [GET] api/rooms/users/:userId
  async getPrivateRoomByUser(req: Request, res: Response, next: NextFunction) {
    const request = {
      myId: req.headers.userId as string,
      userId: req.params.userId,
    };
    const result = await GetPrivateRoomByUserHandler.handle(request);
    res.status(200).json(result);
  }
  // [POST] api/rooms
  async createGroupRoomByUser(req: Request, res: Response, next: NextFunction) {
    const avatar = getLocationFromRequest(req);
    const request = {
      myId: req.headers.userId as string,
      userIds: req.body.userIds,
      name: req.body.name,
      avatar: avatar,
    };
    const result = await CreateGroupRoomHandler.handle(request);
    res.status(200).json(result);
  }
  // [PUT] /:roomId/users/:userId
  async addUserIntoRoom(req: Request, res: Response, next: NextFunction) {
    const request = {
      userId: req.params.userId,
      roomId: req.params.roomId,
    };
    const result = await AddUserIntoRoomHannler.handle(request);
    res.status(200).json(result);
  }
  // [DELETE] /:roomId/users/:userId
  async removeUserFromRoom(req: Request, res: Response, next: NextFunction) {
    const request = {
      userId: req.params.userId,
      roomId: req.params.roomId,
    };
    const result = await RemoveUserFromRoomHannler.handle(request);
    res.status(200).json(result);
  }
  // [GET] api/rooms
  async getMyRooms(req: Request, res: Response, next: NextFunction) {
    const request = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      userId: req.headers.userId as string,
    };
    const result = await GetMyRoomsHandler.handle(request);
    res.status(200).json(result);
  }
  // [GET] api/rooms/messages
  async getMesageByGroup(req: Request, res: Response, next: NextFunction) {
    const request = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      roomId: req.params.roomId as string,
      type: req.query.type as string,
    };
    const result = await GetMessagesHandler.handle(request);
    res.status(200).json(result);
  }
  // [GET] api/rooms/search?q=
  async searchRoom(req: Request, res: Response, next: NextFunction) {
    const request = {
      myId: req.headers.userId as string,
      q: req.query.q as string,
    };
    const result = await SearchRoomHandler.handle(request);
    res.status(200).json(result);
  }
}
export default new RoomController();
