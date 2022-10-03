import SocketServer from "..";
import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import { IMessage, TypeMeesage } from "../../entities/Room";
import getUserByToken from "../util/getUserByToken";

export interface IClientSendMessage {
  token: string;
  roomId: string;
  content: string;
}
export default async (data: IClientSendMessage, socketServer: SocketServer) => {
  if (!data.content || !data.content.trim()) return;
  const user = await getUserByToken(data.token);

  const message: any = {
    user: user._id as string,
    content: data.content,
    type: TypeMeesage.Text,
    createdAt: new Date(),
  };

  const room = await RoomRepository.getRoomSimpleById(data.roomId);
  if (!room) throw new Error("roomId not found");

  // send message socket
  message.user = user;
  const users = room.users.map((user) => user._id);
  socketServer.serverSendMessageToUsers(users, message, data.roomId);

  // insert database
  await RoomRepository.addMessage(message, data.roomId);
};
