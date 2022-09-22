import { Server, Socket } from "socket.io";
import logger from "../../infrastructure/logger";
import { IMessage } from "../entities/Room";
import { IUser } from "../entities/User";
import Client from "./Client";
export default class SocketMain {
  clients: Map<string, string>; // <clientId, UserId>
  users: Map<string, IUser>; // <userId, User>
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    this.users = new Map<string, IUser>(); // <userId, User>
    this.clients = new Map<string, string>(); // <clientId, UserId>
    this.startSocket();
  }

  private startSocket() {
    this.io.on("connection", this.onConnection.bind(this));
  }

  private onConnection(client: Socket) {
    const { token } = client.handshake.query as { token: string };
    logger.info(`Connection from ${client.id}`);

    new Client(client, this, token);
  }
  serverSendMessageToUser(user: IUser, message: IMessage) {}
}
