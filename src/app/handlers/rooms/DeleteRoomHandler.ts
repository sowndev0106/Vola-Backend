import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface ICreateGroupRoomHandler {
  myId: string;
  roomId: string;
}
class GetMyProfileHandler extends Handler<ICreateGroupRoomHandler> {
  protected async validate(request: ICreateGroupRoomHandler) {
    const regexIdMongo = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    if (!request.roomId || !regexIdMongo.test(request.roomId)) {
      throw new ValidationError({ roomId: "roomId invalid" });
    }
  }

  public async handle(request: ICreateGroupRoomHandler): Promise<any> {
    await this.validate(request);
    const room = await RoomRepository.delete(request.roomId);
    return "delete success";
  }
}

export default new GetMyProfileHandler();
