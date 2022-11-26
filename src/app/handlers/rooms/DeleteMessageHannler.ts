import e from "express";
import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import IdValidate from "../../../util/validate/IdValidate";
import StringValidate from "../../../util/validate/StringValidate";
import ValidationError from "../../errors/ValidationError";
import { sendEventUnsendMessageSocket } from "../../socket/handlerOutsite";
import Handler from "../Handler";

export interface IDeleteMessageHandler {
  myId: string;
  messageId: string;
  roomId: string;
}
interface IInputValidated {
  myId: string;
  messageId: string;
  roomId: string;
}
class DeleteMessageHandler extends Handler<IDeleteMessageHandler> {
  protected async validate(
    request: IDeleteMessageHandler
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

  public async handle(request: IDeleteMessageHandler): Promise<any> {
    const input = await this.validate(request);

    const room: any = await RoomRepository.deleteMessage(
      input.messageId,
      input.roomId,
      input.myId
    );
    // send socket
    const data = {
      roomId: input.roomId,
      messageId: input.messageId,
    };
    room?.users?.forEach((e: any) => {
      sendEventUnsendMessageSocket(data, e._id);
    });

    return room;
  }
}
export default new DeleteMessageHandler();
