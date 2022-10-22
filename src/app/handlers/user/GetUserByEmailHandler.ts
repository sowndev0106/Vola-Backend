import { Response } from "express";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import Handler from "../Handler";
export interface IGetMyProfileRequest {
  email: string;
  myId: string;
}
class GetMyProfileHandler extends Handler<IGetMyProfileRequest> {
  protected async validate(request: IGetMyProfileRequest) {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!request.email || !regexEmail.test(request.email))
      throw new Error("Email invalid");
  }

  public async handle(request: IGetMyProfileRequest): Promise<any> {
    await this.validate(request);
    const user = await UserRepository.getUsersByEmail(
      request.email,
      request.myId
    );
    if (!user) throw new Error("Email not found");
    return user;
  }
}

export default new GetMyProfileHandler();
