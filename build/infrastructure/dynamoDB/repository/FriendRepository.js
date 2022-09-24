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
const __1 = __importDefault(require(".."));
const Friend_1 = require("../../../app/entities/Friend");
const Repository_1 = __importDefault(require("./Repository"));
const tableName = "Friends";
class FriendRepository extends Repository_1.default {
    constructor() {
        super(tableName);
    }
    getRequestFriendSend(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: tableName,
                ExpressionAttributeValues: {
                    ":userSend": user,
                    ":status": Friend_1.StatusFriend.Stranger,
                },
                FilterExpression: "userSend= :userSend and status = :status",
            };
            const { Items } = yield __1.default.scan(params).promise();
            return Items ? Items[0] : null;
        });
    }
    getRequestFriendRecive(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: tableName,
                ExpressionAttributeValues: {
                    ":userRecive": user,
                    ":status": Friend_1.StatusFriend.Stranger,
                },
                FilterExpression: "userRecive = :userRecive and status = :status",
            };
            const { Items } = yield __1.default.scan(params).promise();
            return Items ? Items[0] : null;
        });
    }
    getFriendsUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: tableName,
                ExpressionAttributeValues: {
                    ":userRecive": user,
                    ":userSend": user,
                    ":status": Friend_1.StatusFriend.Accepted,
                },
                FilterExpression: "userRecive = :userRecive or userSend= :userSend and status = :status",
            };
            const { Items } = yield __1.default.scan(params).promise();
            return Items ? Items : null;
        });
    }
    getFriendUser(user, user2) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: tableName,
                ExpressionAttributeValues: {
                    ":userRecive": user,
                    ":userSend": user,
                    ":status": Friend_1.StatusFriend.Accepted,
                },
                FilterExpression: "userRecive = :userRecive or userSend= :userSend and status = :status",
            };
            const { Items } = yield __1.default.scan(params).promise();
            return Items ? Items : null;
        });
    }
    acceptRequestFriend(userSend, userRecive) { }
    denyRequestFriend(userSend, userRecive) { }
    unFriend(user1, user2) { }
}
exports.default = new FriendRepository();
