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
const GetPrivateRoomByUserHandler_1 = __importDefault(require("../handlers/rooms/GetPrivateRoomByUserHandler"));
const CreateGroupRoomHandler_1 = __importDefault(require("../handlers/rooms/CreateGroupRoomHandler"));
const GetMyRoomsHandler_1 = __importDefault(require("../handlers/rooms/GetMyRoomsHandler"));
const GetMessagesHandler_1 = __importDefault(require("../handlers/rooms/GetMessagesHandler"));
const AddUserIntoRoomHannler_1 = __importDefault(require("../handlers/rooms/AddUserIntoRoomHannler"));
const SearchRoomHandler_1 = __importDefault(require("../handlers/rooms/SearchRoomHandler"));
class RoomController {
    // [GET] api/rooms/users/:userId
    getPrivateRoomByUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                myId: req.headers.userId,
                userId: req.params.userId,
            };
            const result = yield GetPrivateRoomByUserHandler_1.default.handle(request);
            res.status(200).json(result);
        });
    }
    // [POST] api/rooms
    createGroupRoomByUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                myId: req.headers.userId,
                userIds: req.body.userIds,
                name: req.body.name,
                avatar: req.body.avatar,
            };
            const result = yield CreateGroupRoomHandler_1.default.handle(request);
            res.status(200).json(result);
        });
    }
    // [PUT] api/rooms
    addUserIntoRoom(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                userId: req.params.userId,
                roomId: req.params.roomId,
            };
            const result = yield AddUserIntoRoomHannler_1.default.handle(request);
            res.status(200).json(result);
        });
    }
    // [GET] api/rooms
    getMyRooms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                limit: Number(req.query.limit),
                page: Number(req.query.page),
                userId: req.headers.userId,
            };
            const result = yield GetMyRoomsHandler_1.default.handle(request);
            res.status(200).json(result);
        });
    }
    // [GET] api/rooms/messages
    getMesageByGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                limit: Number(req.query.limit),
                page: Number(req.query.page),
                roomId: req.params.roomId,
                type: req.query.type,
            };
            const result = yield GetMessagesHandler_1.default.handle(request);
            res.status(200).json(result);
        });
    }
    // [GET] api/rooms/search?q=
    searchRoom(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                myId: req.headers.userId,
                q: req.query.q,
            };
            const result = yield SearchRoomHandler_1.default.handle(request);
            res.status(200).json(result);
        });
    }
}
exports.default = new RoomController();
