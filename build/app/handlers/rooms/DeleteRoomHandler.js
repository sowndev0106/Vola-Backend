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
const ValidationError_1 = __importDefault(require("../../errors/ValidationError"));
const Handler_1 = __importDefault(require("../Handler"));
class GetMyProfileHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const regexIdMongo = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
            if (!request.roomId || !regexIdMongo.test(request.roomId)) {
                throw new ValidationError_1.default({ roomId: "roomId invalid" });
            }
            return {
                myId: request.myId,
                roomId: request.roomId,
            };
        });
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = yield this.validate(request);
            const room = yield RoomRepository_1.default.getRoomSimpleById(request.roomId);
            if (!room) {
                throw new Error("Room not found");
            }
            if (room.typeRoom == Room_1.TypeRoom.Private) {
                throw new Error("Can't delete room private");
            }
            if (String(room.owner) != String(input.myId)) {
                throw new Error("you don't have permission to access");
            }
            yield RoomRepository_1.default.delete(request.roomId);
            return "delete success";
        });
    }
}
exports.default = new GetMyProfileHandler();
