import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import StringValidate from "../../../util/validate/StringValidate";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface IChangeOwnerRoomHannler {
  myId: string;
  newOwner: string;
  roomId: string;
}
interface IInputValidated {
  myId: string;
  newOwner: string;
  roomId: string;
}
class ChangeOwnerRoomHannler extends Handler<IChangeOwnerRoomHannler> {
  protected async validate(
    request: IChangeOwnerRoomHannler
  ): Promise<IInputValidated> {
    const newOwner = this._colectErrors.collect("userId", () =>
      StringValidate(request.newOwner)
    );
    const roomId = this._colectErrors.collect("roomId", () =>
      StringValidate(request.roomId)
    );
    if (this._colectErrors.hasError()) {
      throw new ValidationError(this._colectErrors.errors);
    }
    return { newOwner, roomId, myId: request.myId };
  }

  public async handle(request: IChangeOwnerRoomHannler): Promise<any> {
    const input = await this.validate(request);
    const user = await UserRepository.findOneById(input.newOwner);
    if (!user) throw new Error("user not found");
    const room = await RoomRepository.changeOwnerRoom(
      input.newOwner,
      input.roomId,
      input.myId
    );
    return room;
  }
}
export default new ChangeOwnerRoomHannler();
