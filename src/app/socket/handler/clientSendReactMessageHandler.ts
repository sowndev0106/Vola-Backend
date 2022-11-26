import SocketServer from "..";
import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import { IMessage, TypeMeesage } from "../../entities/Room";
import getUserByToken from "../util/getUserByToken";

export interface IClientSendReactMessageMessage {
  token: string;
  roomId: string;
  messageId: string;
  react: string;
}
export default async (
  data: IClientSendReactMessageMessage,
  socketServer: SocketServer
) => {
  const user: any = await getUserByToken(data.token);

  const reactMessage: any = {
    myId: user._id as string,
    roomId: data.roomId,
    messageId: data.messageId,
    react: data.react,
  };
  console.log({ reactMessage });
  const room = await RoomRepository.reactMessage(
    data.messageId,
    data.roomId,
    user._id as string,
    data.react
  );
  if (!room) throw new Error("roomId not found");

  // send message socket

  const users = room.users.map((user) => user._id);
  socketServer.serverSendReactMessageToUsers(
    users,
    data.messageId,
    data.roomId,
    data.react,
    user
  );
};
