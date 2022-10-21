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
const Room_1 = require("../../entities/Room");
const getUserByToken_1 = __importDefault(require("../util/getUserByToken"));
exports.default = (data, socketServer) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.content || !data.content.trim())
        return;
    const user = yield (0, getUserByToken_1.default)(data.token);
    const message = {
        user: user._id,
        content: data.content,
        type: Room_1.TypeMeesage.Text,
        createdAt: new Date(),
    };
    const room = yield RoomRepository_1.default.getRoomSimpleById(data.roomId);
    if (!room)
        throw new Error("roomId not found");
    // send message socket
    message.user = user;
    const users = room.users.map((user) => user._id);
    socketServer.serverSendMessageToUsers(users, message, data.roomId);
    // insert database
    yield RoomRepository_1.default.addMessage(message, data.roomId);
});
