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
const auth_1 = require("@firebase/auth");
const firebaseConfigClient_1 = require("..//..//..//infrastructure/firebase/firebaseConfigClient");
class LoginHandler extends Handler_1.default {
    static handle() {
        throw new Error("Method not implemented.");
    }
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request;
            return { email, password };
        });
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = yield this.validate(request);
            const auth = (0, auth_1.getAuth)(firebaseConfigClient_1.app);
            const userCreate = yield (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
            (0, auth_1.sendEmailVerification)(userCreate.user);
            // const user = await signInWithEmailAndPassword(auth, email, password);
            return userCreate;
        });
    }
}
exports.default = new LoginHandler();
