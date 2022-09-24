"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("../../infrastructure/logger"));
const Client_1 = __importDefault(require("./Client"));
class SocketMain {
    constructor(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
            },
        });
        this.users = new Map(); // <userId, User>
        this.clients = new Map(); // <clientId, UserId>
        this.startSocket();
    }
    startSocket() {
        this.io.on("connection", this.onConnection.bind(this));
    }
    onConnection(client) {
        const { token } = client.handshake.query;
        logger_1.default.info(`Connection from ${client.id}`);
        new Client_1.default(client, this, token);
    }
    serverSendMessageToUser(user, message) { }
}
exports.default = SocketMain;
