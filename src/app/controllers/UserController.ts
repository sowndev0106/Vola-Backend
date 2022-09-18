import { NextFunction, Request, Response } from "express";
import GetMyProfileHandler, {
  IGetMyProfileRequest,
} from "../handlers/user/GetMyProfileHandler";
import GetUserByEmailHandler from "../handlers/user/GetUserByEmailHandler";

class UserController {
  // [GET] api/users/profile
  async getMyProfile(req: Request, res: Response, next: NextFunction) {
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
    const { _id, __v, idProvider, ...props } = result;
    res.status(200).json({
      ...props,
    });
  }
}
export default new UserController();
