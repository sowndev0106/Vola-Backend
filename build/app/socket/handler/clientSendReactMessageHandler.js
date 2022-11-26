"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RoomRepository_1 = __importDefault(require("../../../infrastructure/mongoose/repositories/RoomRepository"));
const getUserByToken_1 = __importDefault(require("../util/getUserByToken"));
exports.default = (data, socketServer) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, getUserByToken_1.default)(data.token);
    const reactMessage = {
        myId: user._id,
        roomId: data.roomId,
        messageId: data.messageId,
        react: data.react,
    };
    console.log({ reactMessage });
    const room = yield RoomRepository_1.default.reactMessage(data.messageId, data.roomId, user._id, data.react);
    if (!room)
        throw new Error("roomId not found");
    // send message socket
    const users = room.users.map((user) => user._id);
    socketServer.serverSendReactMessageToUsers(users, data.messageId, data.roomId, data.react, user);
});
