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
const UserRepository_1 = __importDefault(require("../../../infrastructure/mongoose/repositories/UserRepository"));
const firebase_1 = __importDefault(require("../../../infrastructure/firebase"));
const Client_1 = require("../Client");
exports.default = ({ token, client }) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeValue = yield firebase_1.default
        .auth()
        .verifyIdToken(token.split(" ")[1]);
    if (!decodeValue)
        throw new Error("Token invalid");
    let user = yield UserRepository_1.default.getOneByIdProvider(decodeValue.uid);
    if (!user)
        throw new Error("User not found");
    const userId = String(user._id);
    if (client.status == Client_1.StatusClient.Disconect)
        return;
    let userDriver = client.socketMain.users.get(userId);
    if (userDriver) {
        userDriver.dirver++;
    }
    else {
        userDriver = {
            dirver: 1,
            user: user,
        };
    }
    client.socketMain.users.set(userId, userDriver);
    client.status = Client_1.StatusClient.AsyncUser;
    client.socket.join(userId); // join socket
    client.userId = userId;
});
