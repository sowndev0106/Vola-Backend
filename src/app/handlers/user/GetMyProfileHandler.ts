import { Response } from "express";
import UserRepository from "../../../infrastructure/dynamoDB/repository/UserRepository";
import Handler from "..//Handler";
export interface IGetMyProfileRequest {
  id: string;
}
class GetMyProfileHandler extends Handler<IGetMyProfileRequest> {
  protected async validate(request: IGetMyProfileRequest) {}

  public async handle(request: IGetMyProfileRequest): Promise<any> {
    await this.validate(request);
    const user = await UserRepository.getById(request.id);
    return user;
  }
}

export default new GetMyProfileHandler();
