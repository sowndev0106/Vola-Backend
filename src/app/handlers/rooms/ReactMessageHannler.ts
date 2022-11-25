import e from "express";
import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import IdValidate from "../../../util/validate/IdValidate";
import StringValidate from "../../../util/validate/StringValidate";
import ValidationError from "../../errors/ValidationError";
import {
  sendEventReactMessageSocket,
  sendEventUnsendMessageSocket,
} from "../../socket/handlerOutsite";
import Handler from "../Handler";

export interface IReactMessageHandler {
  myId: string;
  messageId: string;
  roomId: string;
  react: string;
}

interface IInputValidated {
  myId: string;
  messageId: string;
  roomId: string;
  react: string;
}
class ReactMessageHandler extends Handler<IReactMessageHandler> {
  protected async validate(
    request: IReactMessageHandler
  ): Promise<IInputValidated> {
    const messageId = this._colectErrors.collect("messageId", () =>
      IdValidate(request.messageId)
    );
    const roomId = this._colectErrors.collect("roomId", () =>
      IdValidate(request.roomId)
    );
    const react = this._colectErrors.collect("react", () =>
      StringValidate(request.react)
    );
    if (this._colectErrors.hasError()) {
      throw new ValidationError(this._colectErrors.errors);
    }
    return { messageId, roomId, myId: request.myId, react };
  }

  public async handle(request: IReactMessageHandler): Promise<any> {
    const input = await this.validate(request);

    const room: any = await RoomRepository.reactMessage(
      input.messageId,
      input.roomId,
      input.myId,
      input.react
    );
    const user = await UserRepository.findOneById(input.myId);
    // send socket
    const data = {
      roomId: input.roomId,
      messageId: input.messageId,
      react: {
        emoji: input.react,
        user: user,
        createAt: new Date(),
      },
    };
    room?.users?.forEach((e: any) => {
      sendEventReactMessageSocket(data, e._id);
    });

    return data;
  }
}
export default new ReactMessageHandler();
