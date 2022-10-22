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
const Room_1 = require("../../../app/entities/Room");
const Repository_1 = __importDefault(require("./Repository"));
const Room_2 = __importDefault(require("../model/Room"));
const UserRepository_1 = __importDefault(require("./UserRepository"));
const mongoose_1 = __importDefault(require("mongoose"));
class RoomRepository extends Repository_1.default {
    constructor() {
        super(Room_2.default);
    }
    getRoomsByUser(userId, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield Room_2.default.find({ "users._id": userId }, { __v: 0, messages: { $slice: -1 } })
                .limit(limit)
                .skip(offset)
                .sort({ updatedAt: -1 })
                .exec();
            const result = rooms.map((room) => __awaiter(this, void 0, void 0, function* () {
                // private room then add avatar and name room
                if (room.typeRoom == Room_1.TypeRoom.Private) {
                    // because Private room only 2 user and we find user disserent me
                    const id = String(room.users[0]._id) == String(userId)
                        ? room.users[1]._id
                        : room.users[0]._id;
                    // add avatar and different with my user
                    const user = yield UserRepository_1.default.findOneById(id);
                    room.avatar = user === null || user === void 0 ? void 0 : user.avatar;
                    room.name = (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.email);
                }
                delete room.users;
                return room;
            }));
            return Promise.all(result);
        });
    }
    getRoomSimpleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield Room_2.default.findOne({ _id: id }, { messages: 0 }).exec();
            if (!room)
                return null;
            return room;
        });
    }
    getPrivateRoomByUser(myId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository_1.default.findOneById(userId);
            if (!user)
                throw new Error("userId not found");
            var room = yield Room_2.default.findOne({
                typeRoom: Room_1.TypeRoom.Private,
                "users._id": {
                    $all: [myId, userId],
                },
            }, { __v: 0, messages: { $slice: -1 } });
            if (!room) {
                // create new room private
                room = yield this.add({
                    messages: [],
                    users: [{ _id: myId }, { _id: userId }],
                    typeRoom: Room_1.TypeRoom.Private,
                });
            }
            // add avatar and name user in room
            if (!room.avatar)
                room.avatar = user.avatar;
            if (!room.name)
                room.name = user.name;
            return room;
        });
    }
    addMessage(message, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            var room = yield this.getRoomSimpleById(roomId);
            message._id = mongoose_1.default.Types.ObjectId().toString();
            if (!room)
                throw new Error(`Room ${roomId} does not exist`);
            const users = room.users.map((user) => {
                if (message.user == String(user._id)) {
                    // seen message
                    user.lastMessageRead = message._id;
                    user.missing = 0;
                }
                else {
                    if (user.missing)
                        user.missing += 1;
                    else
                        user.missing = 1;
                }
                return user;
            });
            yield Room_2.default.updateOne({ _id: roomId }, { $push: { messages: message }, $set: { users: users } });
            return message;
        });
    }
    addUserIntoRoom(userId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            var room = yield this.getRoomSimpleById(roomId);
            if (!room)
                throw new Error(`Room ${roomId} does not exist`);
            const userExist = room.users.find((e) => e._id == userId);
            if (userExist)
                throw new Error("User exist in room");
            yield Room_2.default.updateOne({ _id: roomId }, { $push: { users: { _id: userId } } });
            room.users.push({ _id: userId });
            return room;
        });
    }
    getMessagesByRoom(roomId, limit, offset, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const aggregates = [];
            aggregates.push({ $match: { _id: mongoose_1.default.Types.ObjectId(roomId) } });
            if (type) {
                aggregates.push({
                    $project: {
                        messages: {
                            $filter: {
                                input: "$messages",
                                as: "messages",
                                cond: { $eq: ["$$messages.type", type] },
                            },
                        },
                    },
                });
            }
            aggregates.push({ $unwind: "$messages" });
            aggregates.push({
                $lookup: {
                    from: "users",
                    localField: "messages.user",
                    foreignField: "_id",
                    as: "messages.user",
                },
            });
            aggregates.push({ $unwind: "$messages.user" });
            aggregates.push({
                $project: {
                    _id: "$messages._id",
                    content: "$messages.content",
                    type: "$messages.type",
                    user: "$messages.user",
                    createdAt: "$messages.createdAt",
                },
            });
            aggregates.push({ $sort: { createdAt: -1 } });
            aggregates.push({ $skip: offset });
            aggregates.push({ $limit: limit });
            const messages = yield Room_2.default.aggregate(aggregates).exec();
            if (!messages)
                return [];
            return messages.reverse();
        });
    }
}
exports.default = new RoomRepository();
