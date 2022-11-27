import { Server, Socket } from "socket.io";
import logger from "../../../infrastructure/logger";
import { IFriendInvite } from "../../entities/Friend";

let socket: Server;
export default (server: Server) => {
  socket = server;
};

export const sendFriendInviteSocket = (friendInvite: any, userId: string) => {
  if (!socket) {
    logger.error("socket in ousite is null");
    return;
  }
  socket.to(String(userId)).emit("send-friend-invite", { friendInvite });
};
export const sendEventUnsendMessageSocket = (data: any, userId: string) => {
  if (!socket) {
    logger.error("socket in ousite is null");
    return;
  }
  socket.to(String(userId)).emit("unsend-message", { ...data });
};

export const sendEventReactMessageSocket = (data: any, userId: string) => {
  if (!socket) {
    logger.error("socket in ousite is null");
    return;
  }
  socket.to(String(userId)).emit("react-message", { ...data });
};

export const sendEventChangeOwnerRoomSocket = (data: any, userId: string) => {
  if (!socket) {
    logger.error("socket in ousite is null");
    return;
  }
  console.log({ data, userId });
  socket.to(String(userId)).emit("change-owner-room-message", { ...data });
};
