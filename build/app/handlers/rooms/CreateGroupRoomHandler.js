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
const UserRepository_1 = __importDefault(require("../../../infrastructure/mongoose/repositories/UserRepository"));
const Room_1 = require("../../entities/Room");
const ValidationError_1 = __importDefault(require("../../errors/ValidationError"));
const Handler_1 = __importDefault(require("../Handler"));
class CreateGroupRoomHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.userIds) {
                throw new ValidationError_1.default({ userIds: "userIds is require" });
            }
            if (!request.name) {
                throw new ValidationError_1.default({ name: "name is require" });
            }
            const ids = Array.from(new Set(request.userIds)); // remove element duplicated
            const idsValidated = [];
            for (let index = 0; index < ids.length; index++) {
                if (ids[index] == request.myId)
                    continue;
                const id = yield this.checKValidateUserId(ids[index]);
                id && idsValidated.push({ _id: id });
            }
            idsValidated.push({ _id: request.myId });
            return {
                userIds: idsValidated,
                name: request.name,
                avatar: request.avatar,
            };
        });
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = yield this.validate(request);
            const room = {
                messages: [],
                typeRoom: Room_1.TypeRoom.Group,
                users: input.userIds,
                avatar: request.avatar,
                name: request.name,
            };
            const result = yield RoomRepository_1.default.add(room);
            return result;
        });
    }
    checKValidateUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const regexIdMongo = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
            if (!regexIdMongo.test(userId))
                return null;
            const user = yield UserRepository_1.default.findOneById(userId);
            if (!user) {
                return null;
            }
            return userId;
        });
    }
}
exports.default = new CreateGroupRoomHandler();
