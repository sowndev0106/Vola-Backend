import { Socket } from "socket.io";
import SocketMain from ".";
import logger from "../../infrastructure/logger";
import addUserHandler from "./handler/addUserHandler";
import clientSendMessageHandler, {
  IClientSendMessage,
} from "./handler/clientSendMessageHandler";
import disconectHandler from "./handler/disconectHandler";
export enum StatusClient {
  Disconect,
  AsyncUser, // status = 'AsyncUser' is Added user into listuser
  Connect,
}
export default class Client {
  socketMain: SocketMain;
  socket: Socket;
  status: StatusClient;
  userId = "";

  constructor(socket: Socket, socketMain: SocketMain, token: string) {
    this.socket = socket;
    this.socketMain = socketMain;
    this.status = StatusClient.Connect; // default
    // add user to list users
    addUserHandler
      .bind(this)({ token, client: this })
      .catch((err) => this.error(socket, err));

    this.addlistenEvent();
  }
  addlistenEvent() {
    this.socket.on("client-send-message", this.onClientSendMessage.bind(this));
    this.socket.on("disconnect", this.onDiscornect.bind(this));
  }

  onDiscornect() {
    disconectHandler(this);
    logger.warn(`Diconnect from ${this.socket.id}`);
  }

  onClientSendMessage(data: IClientSendMessage) {
    clientSendMessageHandler(data, this.socketMain);
  }

  error(socket: Socket, error: any) {
    logger.error("Socket error: ", error);
    socket.emit("error", error);
  }
}
