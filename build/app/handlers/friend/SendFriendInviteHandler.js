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
class SendFriendInviteHandlerHandler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this._colectErrors.collect("userId", () => (0, IdValidate_1.default)(request.userId));
            console.log(request);
            if (this._colectErrors.hasError()) {
                throw new ValidationError_1.default(this._colectErrors.errors);
            }
            // not require
            // const message = this._colectErrors.collect("message", () =>
            //   StringValidate(request.message)
            // );
            const message = "";
            return { myId: request.myId, userId, message };
        });
    }
    handle(request) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const { myId, userId, message } = yield this.validate(request);
            const userRecive = yield UserRepository_1.default.findOneById(userId);
            const userSend = yield UserRepository_1.default.findOneById(myId);
            if (!userRecive)
                throw new Error("userId not found");
            // check friend
            const isExistFriend = !!((_a = userSend.friends) === null || _a === void 0 ? void 0 : _a.find((e) => String(e.userId) == String(userId)));
            if (isExistFriend)
                throw new Error("user already friends");
            // check invite recived
            const isUserSendExistInvite = ((_b = userSend.friendInvites) === null || _b === void 0 ? void 0 : _b.findIndex((e) => String(e.userId) == String(userId))) != -1;
            if (isUserSendExistInvite) {
                // add friend
                // delete friend invite
                userSend.friendInvites =
                    ((_c = userSend.friendInvites) === null || _c === void 0 ? void 0 : _c.filter((e) => {
                        return String(e.userId) != String(userId);
                    })) || [];
                yield this.addFriend(userRecive, userSend);
                return { userId, message };
            }
            // check my user have friend invite
            const isUserReciveExistInvite = ((_d = userRecive === null || userRecive === void 0 ? void 0 : userRecive.friendInvites) === null || _d === void 0 ? void 0 : _d.findIndex((e) => {
                return String(e.userId) == String(myId);
            })) != -1;
            if (isUserReciveExistInvite)
                throw new Error("user already sent an invitation");
            if (!userRecive.friendInvites)
                userRecive.friendInvites = [];
            userRecive.friendInvites.push({
                userId: myId,
                message: message,
            });
            yield UserRepository_1.default.update(userRecive);
            return { userId, message };
        });
    }
    addFriend(userRecive, userSend) {
        return __awaiter(this, void 0, void 0, function* () {
            // recive
            if (!userRecive.friends)
                userRecive.friends = [];
            userRecive.friends.push({ userId: userSend._id });
            //  send
            if (!userSend.friends)
                userSend.friends = [];
            userSend.friends.push({ userId: userRecive._id });
            // update user
            yield UserRepository_1.default.update(userRecive);
            yield UserRepository_1.default.update(userSend);
        });
    }
}
exports.default = new SendFriendInviteHandlerHandler();
