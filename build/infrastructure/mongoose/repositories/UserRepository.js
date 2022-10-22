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
const Repository_1 = __importDefault(require("./Repository"));
const User_1 = __importDefault(require("..//model/User"));
class UserRepository extends Repository_1.default {
    constructor() {
        super(User_1.default);
    }
    getOneByIdProvider(idProvider) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ idProvider }).exec();
            if (!user)
                return null;
            return user;
        });
    }
    getUsersByEmail(email, myId) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield User_1.default.find({ email, _id: { $ne: myId } }).exec();
            if (!users)
                return null;
            const result = users.map((e) => {
                var _a;
                const doc = e._doc;
                const isFriend = !!((_a = e === null || e === void 0 ? void 0 : e.friends) === null || _a === void 0 ? void 0 : _a.find((friend) => String(friend.userId) === String(myId)));
                doc.isFriend = isFriend;
                return doc;
            });
            // console.log(result);
            return result;
        });
    }
    GetOnePopulate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ _id: id })
                .populate({
                path: "friends.userId",
                select: "_id email email avatar name",
            })
                .populate({
                path: "friendInvites.userId",
                select: "_id email email avatar name",
            })
                .exec();
            if (!user)
                return null;
            return user;
        });
    }
    GetFriends(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ _id: id })
                .populate({
                path: "friends.userId",
                select: "_id email email avatar name",
            })
                .exec();
            if (!user)
                return null;
            return user.friends;
        });
    }
}
exports.default = new UserRepository();
