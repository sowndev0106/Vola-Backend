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

  constructor(socket: Socket, socketMain: SocketMain) {
    this.socket = socket;
    this.socketMain = socketMain;
    this.status = StatusClient.Connect; // default

    this.addlistenEvent();
  }

  addlistenEvent() {
    this.socket.on("client-send-message", this.onClientSendMessage.bind(this));
    this.socket.on("disconnect", this.onDiscornect.bind(this));
    this.socket.on("start", this.start.bind(this));
  }
  start(data: any) {
    // add user to list users
    addUserHandler
      .bind(this)({ token: data?.token, client: this })
      .catch((err) => this.error(err));
  }

  onDiscornect() {
    disconectHandler(this);
    logger.warn(`Diconnect from ${this.socket.id}`);
  }

  onClientSendMessage(data: IClientSendMessage) {
    logger.info(`Client ${this.socket.id} send message`);
    clientSendMessageHandler(data, this.socketMain).catch((err) =>
      this.error(err)
    );
  }

  error(error: any) {
    logger.error(`Socket ${this.socket.id} error: `, error);
    this.socket.emit("error", error);
  }
}
