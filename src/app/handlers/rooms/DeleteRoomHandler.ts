import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import { TypeRoom } from "../../entities/Room";
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
    return {
      myId: request.myId,
      roomId: request.roomId,
    };
  }

  public async handle(request: ICreateGroupRoomHandler): Promise<any> {
    const input = await this.validate(request);
    const room = await RoomRepository.getRoomSimpleById(request.roomId);
    if (!room) {
      throw new Error("Room not found");
    }
    if (room.typeRoom == TypeRoom.Private) {
      throw new Error("Can't delete room private");
    }
    if (String(room.owner) != String(input.myId)) {
      throw new Error("you don't have permission to access");
    }
    await RoomRepository.delete(request.roomId);
    return "delete success";
  }
}

export default new GetMyProfileHandler();
