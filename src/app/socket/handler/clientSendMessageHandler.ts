import SocketServer from "..";
import { IMessage, TypeMeesage } from "../../entities/Room";

export interface IClientSendMessage {
  token: string;
  groupId: string;
  content: string;
}
export default (data: IClientSendMessage, socketServer: SocketServer) => {
  const message: IMessage = {
    user: "user",
    content: "content",
    type: TypeMeesage.Text,
    createdAt: new Date(),
  };
  socketServer.serverSendMessageToUsers(["6326c25a880e6552ccfaa26e"], message);
};
