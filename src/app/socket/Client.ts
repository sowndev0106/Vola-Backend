import { Socket } from "socket.io";
import SocketMain from ".";
import logger from "../../infrastructure/logger";
import { IUser } from "../entities/User";
import addUserHandler from "./handler/addUserHandler";
import clientSendMessageHandler, {
  IClientSendMessage,
} from "./handler/clientSendMessageHandler";

export default class Client {
  private client: Socket;
  private socketMain: SocketMain;
  constructor(client: Socket, socketMain: SocketMain, token: string) {
    this.client = client;
    this.socketMain = socketMain;

    // add user to list users
    addUserHandler
      .bind(this)(this.socketMain, token)
      .catch((err) => this.error(client, err));

    this.addlistenEvent();
  }
  addlistenEvent() {
    this.client.on("client-send-message", this.onClientSendMessage.bind(this));
    this.client.on("disconnect", this.onDiscornect.bind(this));
  }

  onDiscornect() {
    const userId = this.socketMain.clients.get(this.client.id);
    if (userId) {
      this.socketMain.users.delete(userId);
    }
    logger.warn(`Diconnect from ${this.client.id}`);
  }

  onClientSendMessage(data: IClientSendMessage) {
    clientSendMessageHandler(data, this.socketMain);
  }

  error(client: Socket, error: any) {
    logger.error("Socket error: ", error);
    client.emit("error", error);
  }
}
