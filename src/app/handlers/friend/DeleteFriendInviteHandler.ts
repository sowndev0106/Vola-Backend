import Handler from "..//Handler";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { app } from "..//..//..//infrastructure/firebase/firebaseConfigClient";
import IdValidate from "../../../util/validate/IdValidate";
import StringValidate from "../../../util/validate/StringValidate";
import ValidationError from "../../errors/ValidationError";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import e from "express";
import { IUser } from "../../entities/User";

export interface IDeleteFriendInviteHandlerRequest {
  myId: string;
  userId: string;
}
interface IInputValidate {
  myId: string;
  userId: string;
}
class DeleteFriendInviteHandlerHandler extends Handler<IDeleteFriendInviteHandlerRequest> {
  protected async validate(
    request: IDeleteFriendInviteHandlerRequest
  ): Promise<IInputValidate> {
    const userId = this._colectErrors.collect("userId", () =>
      IdValidate(request.userId)
    );
    if (this._colectErrors.hasError()) {
      throw new ValidationError(this._colectErrors.errors);
    }
    return { myId: request.myId, userId };
  }

  public async handle(
    request: IDeleteFriendInviteHandlerRequest
  ): Promise<any> {
    let isHaveRequest = false;
    const { myId, userId } = await this.validate(request);
    const userSend = await UserRepository.findOneById(myId);

    // remove friendInvites
    userSend!.friendInvites = userSend!.friendInvites?.filter((e) => {
      const status = String(e.userId) != String(userId);
      if (!status) isHaveRequest = true;
      return status;
    });
    if (!isHaveRequest) throw new Error("request not found");
    await UserRepository.update(userSend!);
  }
}
export default new DeleteFriendInviteHandlerHandler();
