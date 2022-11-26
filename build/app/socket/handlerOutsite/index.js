"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEventAddNewUserIntoRoomSocket = exports.sendEventChangeOwnerRoomSocket = exports.sendEventReactMessageSocket = exports.sendEventUnsendMessageSocket = exports.sendFriendInviteSocket = void 0;
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
const sendEventUnsendMessageSocket = (data, userId) => {
    if (!socket) {
        logger_1.default.error("socket in ousite is null");
        return;
    }
    socket.to(String(userId)).emit("unsend-message", Object.assign({}, data));
};
exports.sendEventUnsendMessageSocket = sendEventUnsendMessageSocket;
const sendEventReactMessageSocket = (data, userId) => {
    if (!socket) {
        logger_1.default.error("socket in ousite is null");
        return;
    }
    socket.to(String(userId)).emit("react-message", Object.assign({}, data));
};
exports.sendEventReactMessageSocket = sendEventReactMessageSocket;
const sendEventChangeOwnerRoomSocket = (data, userId) => {
    if (!socket) {
        logger_1.default.error("socket in ousite is null");
        return;
    }
    socket.to(String(userId)).emit("change-owner-room", Object.assign({}, data));
};
exports.sendEventChangeOwnerRoomSocket = sendEventChangeOwnerRoomSocket;
const sendEventAddNewUserIntoRoomSocket = (data, userId) => {
    if (!socket) {
        logger_1.default.error("socket in ousite is null");
        return;
    }
    socket.to(String(userId)).emit("add-user-room", Object.assign({}, data));
};
exports.sendEventAddNewUserIntoRoomSocket = sendEventAddNewUserIntoRoomSocket;
