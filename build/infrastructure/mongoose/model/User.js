"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("users", new mongoose_1.default.Schema({
    name: String,
    avatar: String,
    email: String,
    provider: String,
    idProvider: String,
    phone: String,
    sex: Boolean,
    dateOfBirth: Date,
    friendInvites: [
        {
            userId: {
                type: mongoose_1.default.Types.ObjectId,
                require: true,
                ref: "users",
            },
            message: String,
            createdAt: { type: Date, default: new Date() },
        },
    ],
    friends: [
        {
            userId: {
                type: mongoose_1.default.Types.ObjectId,
                require: true,
                ref: "users",
            },
            createdAt: { type: Date, default: new Date() },
        },
    ],
}, {
    timestamps: true,
    strict: false,
}));
