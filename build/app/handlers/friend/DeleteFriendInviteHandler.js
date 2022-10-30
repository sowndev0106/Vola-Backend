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
const Handler_1 = __importDefault(require("..//Handler"));
const IdValidate_1 = __importDefault(require("../../../util/validate/IdValidate"));
const ValidationError_1 = __importDefault(require("../../errors/ValidationError"));
const UserRepository_1 = __importDefault(require("../../../infrastructure/mongoose/repositories/UserRepository"));
class DeleteFriendInviteHandlerHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this._colectErrors.collect("userId", () => (0, IdValidate_1.default)(request.userId));
            if (this._colectErrors.hasError()) {
                throw new ValidationError_1.default(this._colectErrors.errors);
            }
            return { myId: request.myId, userId };
        });
    }
    handle(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let isHaveRequest = false;
            const { myId, userId } = yield this.validate(request);
            const userSend = yield UserRepository_1.default.findOneById(myId);
            // remove friendInvites
            userSend.friendInvites = (_a = userSend.friendInvites) === null || _a === void 0 ? void 0 : _a.filter((e) => {
                const status = String(e.userId) != String(userId);
                if (!status)
                    isHaveRequest = true;
                return status;
            });
            if (!isHaveRequest)
                throw new Error("request not found");
            yield UserRepository_1.default.update(userSend);
        });
    }
}
exports.default = new DeleteFriendInviteHandlerHandler();
