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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetFriendsHandler_1 = __importDefault(require("../handlers/friend/GetFriendsHandler"));
const SendFriendInviteHandler_1 = __importDefault(require("../handlers/friend/SendFriendInviteHandler"));
const GetMyProfileHandler_1 = __importDefault(require("../handlers/user/GetMyProfileHandler"));
const GetUserByEmailHandler_1 = __importDefault(require("../handlers/user/GetUserByEmailHandler"));
const GetUserByIdHandler_1 = __importDefault(require("../handlers/user/GetUserByIdHandler"));
const LoginHandler_1 = __importDefault(require("../handlers/user/LoginHandler"));
class UserController {
    // [GET] api/users/profile
    getMyProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                id: req.headers.userId,
            };
            const result = yield GetMyProfileHandler_1.default.handle(request);
            res.status(200).json(result);
        });
    }
    // [PUT] api/users/profile
    updateMyProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                id: req.headers.userId,
            };
            const result = yield GetMyProfileHandler_1.default.handle(request);
            res.status(200).json(result);
        });
    }
    // [GET] api/users/email/:email
    getUserByEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.params.email;
            const myId = req.headers.userId;
            const result = yield GetUserByEmailHandler_1.default.handle({ email, myId });
            res.status(200).json({
                result,
            });
        });
    }
    // [GET] api/users/:id
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const result = yield GetUserByIdHandler_1.default.handle({ id });
            const _a = result._doc, { __v, idProvider, createdAt, updatedAt } = _a, props = __rest(_a, ["__v", "idProvider", "createdAt", "updatedAt"]);
            res.status(200).json(Object.assign({}, props));
        });
    }
    // [POST] api/auth/login
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const result = yield LoginHandler_1.default.handle({ email, password });
            res.status(200).json(result);
        });
    }
    // [POST] api/users/invites
    sendFriendInvite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                myId: req.headers.userId,
                userId: req.body.userId,
                message: req.body.message,
            };
            const result = yield SendFriendInviteHandler_1.default.handle(request);
            res.status(200).json(result);
        });
    }
    // [GET] api/users/friends
    getListFriends(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                myId: req.headers.userId,
            };
            const result = yield GetFriendsHandler_1.default.handle(request);
            res.status(200).json(result);
        });
    }
}
exports.default = new UserController();
