import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface IGetPrivateRoomByUserHandler {
  page: number;
  limit: number;
  userId: string;
}
class GetMyProfileHandler extends Handler<IGetPrivateRoomByUserHandler> {
  protected async validate(request: IGetPrivateRoomByUserHandler) {}

  public async handle(request: IGetPrivateRoomByUserHandler): Promise<any> {
    await this.validate(request);
    if (!request.limit) {
      request.limit = 10;
    }
    if (!request.page) {
      request.page = 1;
    }
    const offset = request.limit * (request.page - 1);
    const room = await RoomRepository.getRoomsByUser(
      request.userId,
      request.limit,
      offset
    );
    return room;
  }
}

export default new GetMyProfileHandler();
