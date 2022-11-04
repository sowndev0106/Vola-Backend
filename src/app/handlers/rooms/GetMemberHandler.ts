import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface IGetPrivateRoomByUserHandler {
  myId: string;
  roomId: string;
}
class GetMyProfileHandler extends Handler<IGetPrivateRoomByUserHandler> {
  protected async validate(request: IGetPrivateRoomByUserHandler) {
    const regexIdMongo = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    if (!request.roomId || !regexIdMongo.test(request.roomId)) {
      throw new ValidationError({ roomId: "roomId invalid" });
    }
  }

  public async handle(request: IGetPrivateRoomByUserHandler): Promise<any> {
    await this.validate(request);

    const room = await RoomRepository.getRoomSimplePopulate(request.roomId);
    return room;
  }
}

export default new GetMyProfileHandler();
