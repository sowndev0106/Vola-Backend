import { User } from "@firebase/auth";
import { Server, Socket } from "socket.io";
import logger from "../../infrastructure/logger";
import UserRepository from "../../infrastructure/mongoose/repositories/UserRepository";
import { IMessage } from "../entities/Room";
import { IUser } from "../entities/User";
import Client from "./Client";
export default class SocketMain {
  users: Map<
    string,
    {
      dirver: number;
      user: IUser;
    }
  >; // <userId, User>
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    this.users = new Map<
      string,
      {
        dirver: number;
        user: IUser;
      }
    >(); // <userId, User>
    this.startSocket();
  }

  private startSocket() {
    this.io.on("connection", this.onConnection.bind(this));
    // this.io.on("start", this.onConnection.bind(this));
  }

  private onConnection(client: Socket) {
    logger.info(`Connection from ${client.id}`);
    new Client(client, this);
  }
  serverSendMessageToUsers(
    userIds: string[],
    message: IMessage,
    roomId: string
  ) {
    userIds.forEach((e) => {
      this.io.to(String(e)).emit("server-send-message", { message, roomId });
    });
  }
  serverSendReactMessageToUsers(
    userIds: string[],
    messageId: string,
    roomId: string,
    react: string,
    user: User
  ) {
    userIds.map(async (e) => {
      const user = await UserRepository.findOneById(e as string);
      this.io
        .to(String(e))
        .emit("server-send-react-message", { messageId, roomId, user, react });
    });
  }
  getSocket(): Server {
    return this.io;
  }
}
