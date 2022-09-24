"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../infrastructure/logger"));
const addUserHandler_1 = __importDefault(require("./handler/addUserHandler"));
const clientSendMessageHandler_1 = __importDefault(require("./handler/clientSendMessageHandler"));
class Client {
    constructor(client, socketMain, token) {
        this.client = client;
        this.socketMain = socketMain;
        // add user to list users
        addUserHandler_1.default
            .bind(this)(this.socketMain, token)
            .catch((err) => this.error(client, err));
        this.addlistenEvent();
    }
    addlistenEvent() {
        this.client.on("client-send-message", this.onClientSendMessage.bind(this));
        this.client.on("disconnect", this.onDiscornect.bind(this));
    }
    onDiscornect() {
        const userId = this.socketMain.clients.get(this.client.id);
        if (userId) {
            this.socketMain.users.delete(userId);
        }
        logger_1.default.warn(`Diconnect from ${this.client.id}`);
    }
    onClientSendMessage(data) {
        (0, clientSendMessageHandler_1.default)(data, this.socketMain);
    }
    error(client, error) {
        logger_1.default.error("Socket error: ", error);
        client.emit("error", error);
    }
}
exports.default = Client;
