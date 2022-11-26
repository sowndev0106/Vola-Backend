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
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("../../infrastructure/logger"));
const UserRepository_1 = __importDefault(require("../../infrastructure/mongoose/repositories/UserRepository"));
const Client_1 = __importDefault(require("./Client"));
class SocketMain {
    constructor(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
            },
        });
        this.users = new Map(); // <userId, User>
        this.startSocket();
    }
    startSocket() {
        this.io.on("connection", this.onConnection.bind(this));
        // this.io.on("start", this.onConnection.bind(this));
    }
    onConnection(client) {
        logger_1.default.info(`Connection from ${client.id}`);
        new Client_1.default(client, this);
    }
    serverSendMessageToUsers(userIds, message, roomId) {
        userIds.forEach((e) => {
            this.io.to(String(e)).emit("server-send-message", { message, roomId });
        });
    }
    serverSendReactMessageToUsers(userIds, messageId, roomId, react, user) {
        userIds.map((e) => __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository_1.default.findOneById(e);
            this.io
                .to(String(e))
                .emit("server-send-react-message", { messageId, roomId, user, react });
        }));
    }
    getSocket() {
        return this.io;
    }
}
exports.default = SocketMain;
