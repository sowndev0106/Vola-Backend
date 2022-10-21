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
const StringValidate_1 = __importDefault(require("../../../util/validate/StringValidate"));
const Handler_1 = __importDefault(require("../Handler"));
class UpdateMyProfileHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this._colectErrors.collect("id", () => (0, StringValidate_1.default)(request._id));
            const name = this._colectErrors.collect("name", () => (0, StringValidate_1.default)(request.name));
            const avatar = this._colectErrors.collect("avatar", () => (0, StringValidate_1.default)(request.avatar));
            return name;
        });
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(request);
            // const user = await UserRepository.findOneById(request._id);
            // const rooms = await RoomRepository.getRoomsByUser(request., 10, 0);
            // return { user, rooms };
        });
    }
}
exports.default = new UpdateMyProfileHandler();
// _id?: string;
// name: string;
// avatar?: string;
// email: string;
// provider: string;
// idProvider: string;
// phone?: string;
// sex?: boolean;
// dateOfBirth?: Date;
