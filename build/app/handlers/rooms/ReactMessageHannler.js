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
const IdValidate_1 = __importDefault(require("../../../util/validate/IdValidate"));
const StringValidate_1 = __importDefault(require("../../../util/validate/StringValidate"));
const ValidationError_1 = __importDefault(require("../../errors/ValidationError"));
const handlerOutsite_1 = require("../../socket/handlerOutsite");
const Handler_1 = __importDefault(require("../Handler"));
class ReactMessageHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageId = this._colectErrors.collect("messageId", () => (0, IdValidate_1.default)(request.messageId));
            const roomId = this._colectErrors.collect("roomId", () => (0, IdValidate_1.default)(request.roomId));
            const react = this._colectErrors.collect("react", () => (0, StringValidate_1.default)(request.react));
            if (this._colectErrors.hasError()) {
                throw new ValidationError_1.default(this._colectErrors.errors);
            }
            return { messageId, roomId, myId: request.myId, react };
        });
    }
    handle(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const input = yield this.validate(request);
            const room = yield RoomRepository_1.default.reactMessage(input.messageId, input.roomId, input.myId, input.react);
            const user = yield UserRepository_1.default.findOneById(input.myId);
            // send socket
            const data = {
                roomId: input.roomId,
                messageId: input.messageId,
                react: {
                    emoji: input.react,
                    user: user,
                    createAt: new Date(),
                },
            };
            (_a = room === null || room === void 0 ? void 0 : room.users) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
                (0, handlerOutsite_1.sendEventReactMessageSocket)(data, e._id);
            });
            return data;
        });
    }
}
exports.default = new ReactMessageHandler();
