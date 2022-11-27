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
const handlerOutsite_1 = require("../../../app/socket/handlerOutsite");
class RoomRepository extends Repository_1.default {
    constructor() {
        super(Room_2.default);
    }
    getRoomsByUser(userId, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield Room_2.default.find({ "users._id": userId }, { __v: 0, messages: { $slice: -1 } })
                .populate({ path: "messages.reacts.user", select: "_id email avatar " })
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
            room.messages = [];
            return room;
        });
    }
    getRoomSimplePopulate(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield Room_2.default.findOne({ _id: id }, { messages: 0 })
                .populate("users._id")
                .exec();
            if (room)
                room.messages = [];
            if (!room)
                return null;
            room.users = (_a = room.users) === null || _a === void 0 ? void 0 : _a.map((e) => {
                return {
                    missing: e.missing,
                    user: e._id,
                };
            });
            return room;
        });
    }
    getPrivateRoomByUser(myId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository_1.default.findOneById(userId);
            const myUser = yield UserRepository_1.default.findOneById(myId);
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
                const result = room === null || room === void 0 ? void 0 : room._doc;
                result.avatar = myUser === null || myUser === void 0 ? void 0 : myUser.avatar;
                result.name = myUser === null || myUser === void 0 ? void 0 : myUser.name;
                (0, handlerOutsite_1.sendEventCreateNewRoomSocket)(result, userId);
                result.avatar = user.avatar;
                result.name = user.name;
                (0, handlerOutsite_1.sendEventCreateNewRoomSocket)(result, myId);
                return room;
            }
            // add avatar and name user in room
            room.avatar = user.avatar;
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
                    reacts: "$messages.reacts",
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
    removeUserFromRoom(userId, roomId, myId) {
        return __awaiter(this, void 0, void 0, function* () {
            var room = yield this.getRoomSimpleById(roomId);
            if (String(room === null || room === void 0 ? void 0 : room.owner) != String(myId)) {
                throw new Error("you don't have permission to access");
            }
            if (!room)
                throw new Error(`Room ${roomId} does not exist`);
            const userExist = room.users.find((e) => e._id == userId);
            if (!userExist)
                throw new Error("User not exist in room");
            yield Room_2.default.updateOne({ _id: roomId }, { $pull: { users: { _id: userId } } });
            room.users = room.users.filter((e) => e._id != userId);
            return room;
        });
    }
    updateNameRoom(userId, name, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            var room = yield this.getRoomSimpleById(roomId);
            if (!room)
                throw new Error(`Room ${roomId} does not exist`);
            const userExist = room.users.find((e) => e._id == userId);
            if (userExist)
                throw new Error("User not permisson");
            yield Room_2.default.updateOne({ _id: roomId }, { name });
            room.name = name;
            return room;
        });
    }
    updateAvatarRoom(userId, avatar, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            var room = yield this.getRoomSimpleById(roomId);
            if (!room)
                throw new Error(`Room ${roomId} does not exist`);
            const userExist = room.users.find((e) => e._id == userId);
            if (userExist)
                throw new Error("User not permisson");
            yield Room_2.default.updateOne({ _id: roomId }, { avatar });
            // delete avatar old
            // deleteFileS3ByLink(room.avatar);
            room.avatar = avatar;
            return room;
        });
    }
    changeOwnerRoom(newOwner, roomId, myId) {
        return __awaiter(this, void 0, void 0, function* () {
            var room = yield this.getRoomSimpleById(roomId);
            if (String(room === null || room === void 0 ? void 0 : room.owner) != String(myId)) {
                // throw new Error("you don't have permission to access");
            }
            if (!room)
                throw new Error(`Room ${roomId} does not exist`);
            const userExist = room.users.find((e) => e._id == newOwner);
            if (!userExist)
                throw new Error("User not exist in room");
            yield Room_2.default.updateOne({ _id: roomId }, { owner: newOwner });
            room.owner = newOwner;
            return room;
        });
    }
    deleteMessage(messageId, roomId, myId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Room_2.default.updateOne({ _id: roomId, "messages._id": messageId }, {
                $set: {
                    "messages.$.type": Room_1.TypeMeesage.Unsend,
                },
            });
            return yield this.getRoomSimpleById(roomId);
        });
    }
    reactMessage(messageId, roomId, myId, react) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield Room_2.default.findById(roomId);
            const reacts = [];
            let isAlreadyReact = false;
            (_a = room === null || room === void 0 ? void 0 : room.reacts) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
                if (String(e === null || e === void 0 ? void 0 : e.user) == String(myId)) {
                    // already react
                    e.emoji = react;
                    isAlreadyReact = true;
                }
                reacts.push(e);
            });
            if (!isAlreadyReact) {
                reacts.push({ emoji: react, user: myId, createAt: new Date() });
            }
            // add new React
            yield Room_2.default.updateOne({ _id: roomId, "messages._id": messageId }, {
                $set: {
                    "messages.$.reacts": reacts,
                },
            });
            return yield this.getRoomSimpleById(roomId);
        });
    }
    GetReactMessage(messageId, roomId, myId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // add new React
            const result = yield Room_2.default.findOne({
                _id: roomId,
                "messages._id": messageId,
            }, { "messages.$": 1 }).populate({ path: "messages.reacts.user", select: "_id email avatar " });
            const reacts = (_a = result === null || result === void 0 ? void 0 : result.messages[0]) === null || _a === void 0 ? void 0 : _a.reacts;
            return reacts ? reacts : [];
        });
    }
    readMessageInRoom(roomId, myId) {
        return __awaiter(this, void 0, void 0, function* () {
            // add new React
            const result = yield Room_2.default.updateOne({
                _id: roomId,
                "users._id": myId,
            }, {
                $set: {
                    "users.$.missing": 0,
                },
            });
            return result;
        });
    }
}
exports.default = new RoomRepository();
