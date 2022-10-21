"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Room_1 = require("..//..//..//app/entities/Room");
exports.default = mongoose_1.default.model("rooms", new mongoose_1.default.Schema({
    users: [
        {
            _id: { type: mongoose_1.default.Types.ObjectId, require: true, ref: "users" },
            lastMessageRead: { type: mongoose_1.default.Types.ObjectId },
            deletedAt: Date,
            missing: { type: Number, default: 0 }
        },
    ],
    messages: [
        {
            _id: String,
            user: { type: mongoose_1.default.Types.ObjectId, require: true, ref: "users" },
            content: String,
            type: {
                type: String,
                enum: Room_1.TypeMeesage,
                default: Room_1.TypeMeesage.Text,
            },
        },
    ],
    typeRoom: {
        type: String,
        enum: Room_1.TypeRoom,
        default: Room_1.TypeRoom.Group,
    },
    name: String,
    avatar: String,
}, {
    timestamps: true,
    strict: false,
}));
