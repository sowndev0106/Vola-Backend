import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import StringValidate from "../../../util/validate/StringValidate";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface IAddUserIntoRoomHandler {
  userId: string;
  roomId: string;
}
interface IInputValidated {
  userId: string;
  roomId: string;
}
class AddUserIntoRoomHandler extends Handler<IAddUserIntoRoomHandler> {
  protected async validate(
    request: IAddUserIntoRoomHandler
  ): Promise<IInputValidated> {
    const userId = this._colectErrors.collect("userId", () =>
      StringValidate(request.userId)
    );
    const roomId = this._colectErrors.collect("roomId", () =>
      StringValidate(request.roomId)
    );
    if (this._colectErrors.hasError()) {
      throw new ValidationError(this._colectErrors.errors);
    }
    return { userId, roomId };
  }

  public async handle(request: IAddUserIntoRoomHandler): Promise<any> {
    const input = await this.validate(request);
    const user = await UserRepository.findOneById(input.userId);
    if (!user) throw new Error("user not found");
    const room = await RoomRepository.removeUserFromRoom(
      input.userId,
      input.roomId
    );
    return room;
  }
}
export default new AddUserIntoRoomHandler();
