import { Server, Socket as Client } from "socket.io";
import { IUser } from "../entities/User";
import addUserHandler from "./handler/addUserHandler";
export default class Socket {
  private users: IUser[] = [];
  private io: Server;
  constructor(server: any) {
    this.io = new Server(server);
    this.startSocket();
  }
  private startSocket() {
    this.io.on("connection", this.connection);
  }
  private connection(client: Client) {
    const { token } = client.data;

    // add user to list users
    addUserHandler(this.users, token).catch((error) =>
      this.error(client, error)
    );
  }
  private error(client: Client, error: any) {
    
    client.emit("error", error);
  }
}
