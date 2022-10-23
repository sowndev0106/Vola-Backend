import { NextFunction, Request, Response } from "express";
import DeleteFriendInviteHandler from "../handlers/friend/DeleteFriendInviteHandler";
import GetFriendsHandler from "../handlers/friend/GetFriendsHandler";
import SendFriendInviteHandler from "../handlers/friend/SendFriendInviteHandler";
import GetMyProfileHandler, {
  IGetMyProfileRequest,
} from "../handlers/user/GetMyProfileHandler";
import GetUserByEmailHandler from "../handlers/user/GetUserByEmailHandler";
import GetUserByIdHandler from "../handlers/user/GetUserByIdHandler";
import LoginHandler from "../handlers/user/LoginHandler";
import { sendFriendInviteSocket } from "../socket/handlerOutsite";

class UserController {
  // [POST] api/auth/login
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const result = await LoginHandler.handle({ email, password });
    res.status(200).json(result);
  }
  // [GET] api/users/profile
  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    const request: IGetMyProfileRequest = {
      id: req.headers.userId as string,
    };
    const result = await GetMyProfileHandler.handle(request);
    res.status(200).json(result);
  }
  // [PUT] api/users/profile
  async updateMyProfile(req: Request, res: Response, next: NextFunction) {
    const request: IGetMyProfileRequest = {
      id: req.headers.userId as string,
    };
    const result = await GetMyProfileHandler.handle(request);
    res.status(200).json(result);
  }
  // [GET] api/users/email/:email
  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    const email = req.params.email as string;
    const myId = req.headers.userId as string;
    const result = await GetUserByEmailHandler.handle({ email, myId });
    res.status(200).json({
      result,
    });
  }
  // [GET] api/users/:id
  async getUserById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    const result = await GetUserByIdHandler.handle({ id });
    const { __v, idProvider, createdAt, updatedAt, ...props } = result._doc;
    res.status(200).json({
      ...props,
    });
  }

  // [POST] api/users/invites
  async sendFriendInvite(req: Request, res: Response, next: NextFunction) {
    const request = {
      myId: req.headers.userId as string,
      userId: req.body.userId as string,
      message: req.body.message,
    };
    const result = await SendFriendInviteHandler.handle(request);
    sendFriendInviteSocket(result, request.userId);
    res.status(200).json(result);
  }
  // [GET] api/users/friends
  async getListFriends(req: Request, res: Response, next: NextFunction) {
    const request = {
      myId: req.headers.userId as string,
    };
    const result = await GetFriendsHandler.handle(request);
    res.status(200).json(result);
  }
  // [DELETE] api/users/invites
  async deleteFriendInvite(req: Request, res: Response, next: NextFunction) {
    const request = {
      myId: req.headers.userId as string,
      userId: req.body.userId as string,
    };
    const result = await DeleteFriendInviteHandler.handle(request);
    res.status(200).json(result);
  }
}
export default new UserController();
