import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import StringValidate from "../../../util/validate/StringValidate";
import ValidationError from "../../errors/ValidationError";
import Handler from "../Handler";

export interface IAddUserIntoRoomHandler {
  userIds: string[];
  roomId: string;
}
interface IInputValidated {
  userIds: Array<{ _id: string }>;
  roomId: string;
}
class AddUserIntoRoomHandler extends Handler<IAddUserIntoRoomHandler> {
  protected async validate(
    request: IAddUserIntoRoomHandler
  ): Promise<IInputValidated> {
    const roomId = this._colectErrors.collect("roomId", () =>
      StringValidate(request.roomId)
    );
    if (this._colectErrors.hasError()) {
      throw new ValidationError(this._colectErrors.errors);
    }
    const ids = Array.from(new Set(request.userIds)); // remove element duplicated
    const userIds: Array<{ _id: string }> = [];
    for (let index = 0; index < ids.length; index++) {
      const id = await this.checKValidateUserId(ids[index]);
      console.log(!!id);
      id && userIds.push({ _id: id });
    }
    return { userIds, roomId };
  }

  public async handle(request: IAddUserIntoRoomHandler): Promise<any> {
    const input = await this.validate(request);
    const room = await RoomRepository.getRoomSimpleById(input.roomId);
    for (const userInput of input.userIds || []) {
      if (
        !!room?.users.find((user) => String(user._id) == String(userInput._id))
      )
        // exist
        continue;
      try {
        await RoomRepository.addUserIntoRoom(userInput._id, input.roomId);
      } catch (error) {
        console.log(error);
      }
    }
    return await RoomRepository.getRoomSimpleById(input.roomId);
  }
  private async checKValidateUserId(userId: string): Promise<string | null> {
    const regexIdMongo = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    if (!regexIdMongo.test(userId)) return null;
    const user = await UserRepository.findOneById(userId);
    if (!user) {
      return null;
    }
    return userId;
  }
}
export default new AddUserIntoRoomHandler();
