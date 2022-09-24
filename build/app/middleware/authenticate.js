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
const UserRepository_1 = __importDefault(require("../../infrastructure/mongoose/repositories/UserRepository"));
const firebase_1 = __importDefault(require("..//..//infrastructure/firebase"));
const HeaderTokenInvalidError_1 = __importDefault(require("../errors/HeaderTokenInvalidError"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        throw new HeaderTokenInvalidError_1.default("authorization token is required");
    }
    try {
        const decodeValue = yield firebase_1.default.auth().verifyIdToken(token);
        if (!decodeValue) {
            throw new Error();
        }
        const { name, uid, picture, firebase, email } = decodeValue;
        let user = yield UserRepository_1.default.getOneByIdProvider(decodeValue.uid);
        if (!user) {
            // create new user
            user = yield UserRepository_1.default.add({
                idProvider: uid,
                name: name,
                avatar: picture,
                provider: firebase["sign_in_provider"],
                email: email,
            });
        }
        req.headers.userId = user._id;
        return next();
    }
    catch (error) {
        console.log(error);
        throw new HeaderTokenInvalidError_1.default("authorization token invalid");
    }
});
