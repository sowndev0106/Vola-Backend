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
const Handler_1 = __importDefault(require("../Handler"));
class GetMyProfileHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(request);
            if (!request.limit) {
                request.limit = 10;
            }
            if (!request.page) {
                request.page = 1;
            }
            const offset = request.limit * (request.page - 1);
            const room = yield RoomRepository_1.default.getRoomsByUser(request.userId, request.limit, offset);
            return room;
        });
    }
}
exports.default = new GetMyProfileHandler();
