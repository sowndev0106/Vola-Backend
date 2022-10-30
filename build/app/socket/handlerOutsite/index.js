"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFriendInviteSocket = void 0;
const logger_1 = __importDefault(require("../../../infrastructure/logger"));
let socket;
exports.default = (server) => {
    socket = server;
};
const sendFriendInviteSocket = (friendInvite, userId) => {
    if (!socket) {
        logger_1.default.error("socket in ousite is null");
        return;
    }
    socket.to(String(userId)).emit("send-friend-invite", { friendInvite });
};
exports.sendFriendInviteSocket = sendFriendInviteSocket;
