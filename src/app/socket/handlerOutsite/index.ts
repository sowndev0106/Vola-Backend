import { Server, Socket } from "socket.io";
import logger from "../../../infrastructure/logger";
import { IFriendInvite } from "../../entities/Friend";

let socket: Server;
export default (server: Server) => {
  socket = server;
};

export const sendFriendInviteSocket = (friendInvite: IFriendInvite) => {
  if (!socket) {
    logger.error("socket in ousite is null");
    return;
  }
  socket
    .to(String(friendInvite.userId))
    .emit("send-friend-invite", { friendInvite });
};
