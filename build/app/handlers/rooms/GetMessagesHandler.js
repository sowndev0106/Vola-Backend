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
const Handler_1 = __importDefault(require("../Handler"));
class GetMessagesHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let { limit, page, roomId, type } = request;
            if (!limit)
                limit = 10;
            if (!page)
                page = 1;
            if (!Object.values(Room_1.TypeMeesage).includes(type))
                type = null;
            return {
                limit,
                page,
                roomId,
                type,
            };
        });
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, page, roomId, type } = yield this.validate(request);
            const offset = limit * (page - 1);
            const messages = yield RoomRepository_1.default.getMessagesByRoom(roomId, limit, offset, type);
            return messages;
        });
    }
}
exports.default = new GetMessagesHandler();
