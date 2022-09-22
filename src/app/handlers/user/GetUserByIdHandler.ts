import { Response } from "express";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import Handler from "../Handler";
export interface IGetMyProfileRequest {
  id: string;
}
class GetMyProfileHandler extends Handler<IGetMyProfileRequest> {
  protected async validate(request: IGetMyProfileRequest) {
    if (!request.id || !request.id.trim()) throw new Error("Id invalid");
  }

  public async handle(request: IGetMyProfileRequest): Promise<any> {
    await this.validate(request);
    const user = await UserRepository.findOneById(request.id);
    if (!user) throw new Error("UserId not found");
    return user;
  }
}

export default new GetMyProfileHandler();
