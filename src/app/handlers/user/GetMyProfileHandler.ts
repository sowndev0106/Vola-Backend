import { Response } from "express";
import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import Handler from "..//Handler";
export interface IGetMyProfileRequest {
  id: string;
}
class GetMyProfileHandler extends Handler<IGetMyProfileRequest> {
  protected async validate(request: IGetMyProfileRequest) {}
  public async handle(request: IGetMyProfileRequest): Promise<any> {
    await this.validate(request);
    const user = await UserRepository.GetOnePopulate(request.id);
    const rooms = await RoomRepository.getRoomsByUser(request.id, 10, 0);
    return { user, rooms };
  }
}
export default new GetMyProfileHandler();
