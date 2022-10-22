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
const StringValidate_1 = __importDefault(require("../../../util/validate/StringValidate"));
const ValidationError_1 = __importDefault(require("../../errors/ValidationError"));
const Handler_1 = __importDefault(require("../Handler"));
class GetMyProfileHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = this._colectErrors.collect("q", () => (0, StringValidate_1.default)(request.q));
            if (this._colectErrors.hasError()) {
                throw new ValidationError_1.default(this._colectErrors.errors);
            }
            return { q: q.toLowerCase(), myId: request.myId };
        });
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = yield this.validate(request);
            const rooms = yield RoomRepository_1.default.getRoomsByUser(input.myId, 1000, 0);
            const result = rooms.filter((e) => {
                var _a;
                if (((_a = e === null || e === void 0 ? void 0 : e.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().indexOf(input.q)) != -1) {
                    return true;
                }
                return false;
            });
            return result;
        });
    }
}
exports.default = new GetMyProfileHandler();
