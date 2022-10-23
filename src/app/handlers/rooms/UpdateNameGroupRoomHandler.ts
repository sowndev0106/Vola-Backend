import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import { deleteFileS3ByLink } from "../../../infrastructure/s3/handler";
import { IRoom, TypeRoom } from "../../entities/Room";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface IUpdateNameGroupRoomHandler {
  myId: string;
  roomId: string;
  name: string;
}
interface IInputValidated {
  myId: string;
  roomId: string;
  name: string;
}
class UpdateNameGroupRoomHandler extends Handler<IUpdateNameGroupRoomHandler> {
  protected async validate(
    request: IUpdateNameGroupRoomHandler
  ): Promise<IInputValidated> {
    if (!request.name) {
      throw new ValidationError({ name: "name is require" });
    }
    if (!request.roomId) {
      throw new ValidationError({ roomId: "roomId is require" });
    }

    return {
      name: request.name,
      myId: request.myId,
      roomId: request.roomId,
    };
  }

  public async handle(request: IUpdateNameGroupRoomHandler): Promise<any> {
    const input = await this.validate(request);

    const result = await RoomRepository.updateNameRoom(
      input.myId,
      input.name,
      input.roomId
    );

    return result;
  }
}
export default new UpdateNameGroupRoomHandler();
