import { NextFunction, Request, Response } from "express";
import GetMyProfileHandler, {
  IGetMyProfileRequest,
} from "../handlers/user/GetMyProfileHandler";

class UserController {
  // [GET] api/users/profile
  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    const request: IGetMyProfileRequest = {
      id: req.headers.userId as string,
    };
    const result = await GetMyProfileHandler.handle(request);
    res.status(200).json(result);
  }
}
export default new UserController();
