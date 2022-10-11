import Handler from "..//Handler";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { app } from "..//..//..//infrastructure/firebase/firebaseConfigClient";
import IdValidate from "../../../util/validate/IdValidate";
import StringValidate from "../../../util/validate/StringValidate";
import ValidationError from "../../errors/ValidationError";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import e from "express";
import { IUser } from "../../entities/User";

export interface ISendFriendInviteHandlerRequest {
  myId: string;
}
interface IInputValidate {
  myId: string;
}
class SendFriendInviteHandlerHandler extends Handler<ISendFriendInviteHandlerRequest> {
  protected async validate(
    request: ISendFriendInviteHandlerRequest
  ): Promise<IInputValidate> {
    return { myId: request.myId };
  }
  public async handle(request: ISendFriendInviteHandlerRequest): Promise<any> {
    const { myId } = await this.validate(request);
    const friends = await UserRepository.GetFriends(myId);
    return friends;
  }
}
export default new SendFriendInviteHandlerHandler();
