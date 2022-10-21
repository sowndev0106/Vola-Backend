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
const StringValidate_1 = __importDefault(require("../../../util/validate/StringValidate"));
const ValidationError_1 = __importDefault(require("../../errors/ValidationError"));
const Handler_1 = __importDefault(require("../Handler"));
class AddUserIntoRoomHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this._colectErrors.collect("userId", () => (0, StringValidate_1.default)(request.userId));
            const roomId = this._colectErrors.collect("roomId", () => (0, StringValidate_1.default)(request.roomId));
            if (this._colectErrors.hasError()) {
                throw new ValidationError_1.default(this._colectErrors.errors);
            }
            return { userId,
                roomId };
        });
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = yield this.validate(request);
            const user = yield UserRepository_1.default.findOneById(input.userId);
            if (!user)
                throw new Error("user not found");
            const room = yield RoomRepository_1.default.addUserIntoRoom(input.userId, input.roomId);
            return room;
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
exports.default = new AddUserIntoRoomHandler();
