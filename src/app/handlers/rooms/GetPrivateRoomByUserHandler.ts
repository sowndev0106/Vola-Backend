import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface IGetPrivateRoomByUserHandler {
  myId: string;
  userId: string;
}
class GetMyProfileHandler extends Handler<IGetPrivateRoomByUserHandler> {
  protected async validate(request: IGetPrivateRoomByUserHandler) {
    const regexIdMongo = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    if (!request.userId || !regexIdMongo.test(request.userId)) {
      throw new ValidationError({ userId: "Id user invalid" });
    }
    if (request.myId == request.userId) {
      throw new ValidationError({ userId: "Can't get room with your self" });
    }
  }

  public async handle(request: IGetPrivateRoomByUserHandler): Promise<any> {
    await this.validate(request);

    const room = await RoomRepository.getPrivateRoomByUser(
      request.myId,
      request.userId
    );
    return room;
  }
}

export default new GetMyProfileHandler();
