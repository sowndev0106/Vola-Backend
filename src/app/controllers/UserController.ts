import { NextFunction, Request, Response } from "express";
import GetMyProfileHandler, {
  IGetMyProfileRequest,
} from "../handlers/user/GetMyProfileHandler";
import GetUserByEmailHandler from "../handlers/user/GetUserByEmailHandler";
import GetUserByIdHandler from "../handlers/user/GetUserByIdHandler";

class UserController {
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
    const result = await GetUserByEmailHandler.handle({ email });
    const { __v, idProvider, createdAt, updatedAt, ...props } = result._doc;
    res.status(200).json({
      ...props,
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
}
export default new UserController();
