import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import { deleteFileS3ByLink } from "../../../infrastructure/s3/handler";
import { IRoom, TypeRoom } from "../../entities/Room";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface IUpdateAvatarGroupRoomHandler {
  myId: string;
  roomId: string;
  avatar: string;
}
interface IInputValidated {
  myId: string;
  roomId: string;
  avatar: string;
}
class UpdateAvatarGroupRoomHandler extends Handler<IUpdateAvatarGroupRoomHandler> {
  protected async validate(
    request: IUpdateAvatarGroupRoomHandler
  ): Promise<IInputValidated> {
    if (!request.avatar) {
      throw new ValidationError({ avatar: "avatar is require" });
    }
    if (!request.roomId) {
      throw new ValidationError({ roomId: "roomId is require" });
    }

    return {
      avatar: request.avatar,
      myId: request.myId,
      roomId: request.roomId,
    };
  }

  public async handle(request: IUpdateAvatarGroupRoomHandler): Promise<any> {
    const input = await this.validate(request);

    const result = await RoomRepository.updateAvatarRoom(
      input.myId,
      input.avatar,
      input.roomId
    );

    return result;
  }
}
export default new UpdateAvatarGroupRoomHandler();
