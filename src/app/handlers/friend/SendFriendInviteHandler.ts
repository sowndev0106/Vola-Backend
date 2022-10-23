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
  userId: string;
  message: string;
}
interface IInputValidate {
  myId: string;
  userId: string;
  message: string;
}
class SendFriendInviteHandlerHandler extends Handler<ISendFriendInviteHandlerRequest> {
  protected async validate(
    request: ISendFriendInviteHandlerRequest
  ): Promise<IInputValidate> {
    const userId = this._colectErrors.collect("userId", () =>
      IdValidate(request.userId)
    );
    if (this._colectErrors.hasError()) {
      throw new ValidationError(this._colectErrors.errors);
    }
    // not require
    // const message = this._colectErrors.collect("message", () =>
    //   StringValidate(request.message)
    // );
    const message = "";
    return { myId: request.myId, userId, message };
  }

  public async handle(request: ISendFriendInviteHandlerRequest): Promise<any> {
    let isFriend = false;
    const { myId, userId, message } = await this.validate(request);
    const userRecive = await UserRepository.findOneById(userId);
    const userSend = await UserRepository.findOneById(myId);
    if (!userRecive) throw new Error("userId not found");

    // check friend
    let isExistFriend = !!userSend!.friends?.find(
      (e) => String(e.userId) == String(userId)
    );
    if (isExistFriend) throw new Error("user already friends");
    // check invite recived
    const isUserSendExistInvite =
      userSend!.friendInvites?.findIndex(
        (e) => String(e.userId) == String(userId)
      ) != -1;
    if (isUserSendExistInvite) {
      // add friend
      isFriend = true;
      // delete friend invite
      userSend!.friendInvites =
        userSend!.friendInvites?.filter((e) => {
          return String(e.userId) != String(userId);
        }) || [];
      await this.addFriend(userRecive, userSend!);
      return { user: userSend, message, isFriend };
    }

    // check my user have friend invite
    const isUserReciveExistInvite =
      userRecive?.friendInvites?.findIndex((e) => {
        return String(e.userId) == String(myId);
      }) != -1;
    if (isUserReciveExistInvite)
      throw new Error("user already sent an invitation");

    if (!userRecive.friendInvites) userRecive.friendInvites = [];
    userRecive.friendInvites.push({
      userId: myId,
      message: message,
    });
    await UserRepository.update(userRecive);
    return { user: userRecive, message, isFriend: isExistFriend };
  }

  private async addFriend(userRecive: IUser, userSend: IUser) {
    // recive
    if (!userRecive.friends) userRecive.friends = [];
    userRecive.friends.push({ userId: userSend._id! });

    //  send
    if (!userSend!.friends) userSend!.friends = [];
    userSend.friends.push({ userId: userRecive._id! });

    // update user
    await UserRepository.update(userRecive);
    await UserRepository.update(userSend);
  }
}
export default new SendFriendInviteHandlerHandler();
