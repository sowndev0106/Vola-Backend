import e from "express";
import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import IdValidate from "../../../util/validate/IdValidate";
import StringValidate from "../../../util/validate/StringValidate";
import ValidationError from "../../errors/ValidationError";

import Handler from "../Handler";

export interface IReadMessageInRoomHandler {
  myId: string;
  roomId: string;
}

interface IInputValidated {
  myId: string;
  roomId: string;
}
class ReadMessageInRoomHandler extends Handler<IReadMessageInRoomHandler> {
  protected async validate(
    request: IReadMessageInRoomHandler
  ): Promise<IInputValidated> {
    const roomId = this._colectErrors.collect("roomId", () =>
      IdValidate(request.roomId)
    );

    if (this._colectErrors.hasError()) {
      throw new ValidationError(this._colectErrors.errors);
    }
    return { roomId, myId: request.myId };
  }

  public async handle(request: IReadMessageInRoomHandler): Promise<any> {
    const input = await this.validate(request);

    const result: any = await RoomRepository.readMessageInRoom(
      input.roomId,
      input.myId
    );

    return result;
  }
}
export default new ReadMessageInRoomHandler();
