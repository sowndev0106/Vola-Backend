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
const Handler_1 = __importDefault(require("../Handler"));
class GetMyProfileHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.id || !request.id.trim())
                throw new Error("Id invalid");
        });
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(request);
            const user = yield UserRepository_1.default.findOneById(request.id);
            if (!user)
                throw new Error("UserId not found");
            return user;
        });
    }
}
exports.default = new GetMyProfileHandler();
