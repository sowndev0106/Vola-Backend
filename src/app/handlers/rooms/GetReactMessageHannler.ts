import e from "express";
import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import IdValidate from "../../../util/validate/IdValidate";
import StringValidate from "../../../util/validate/StringValidate";
import ValidationError from "../../errors/ValidationError";

import Handler from "../Handler";

export interface IGetReactMessageHandler {
  myId: string;
  messageId: string;
  roomId: string;
}

interface IInputValidated {
  myId: string;
  messageId: string;
  roomId: string;
}
class GetReactMessageHandler extends Handler<IGetReactMessageHandler> {
  protected async validate(
    request: IGetReactMessageHandler
  ): Promise<IInputValidated> {
    const messageId = this._colectErrors.collect("messageId", () =>
      IdValidate(request.messageId)
    );
    const roomId = this._colectErrors.collect("roomId", () =>
      IdValidate(request.roomId)
    );

    if (this._colectErrors.hasError()) {
      throw new ValidationError(this._colectErrors.errors);
    }
    return { messageId, roomId, myId: request.myId };
  }

  public async handle(request: IGetReactMessageHandler): Promise<any> {
    const input = await this.validate(request);

    const result: any = await RoomRepository.GetReactMessage(
      input.messageId,
      input.roomId,
      input.myId
    );

    return result;
  }
}
export default new GetReactMessageHandler();
