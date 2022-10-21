"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CollectErrors_1 = __importDefault(require("../errors/CollectErrors"));
class Handler {
    constructor() {
        this._colectErrors = new CollectErrors_1.default();
    }
}
exports.default = Handler;
