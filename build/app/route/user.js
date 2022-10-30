"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
router.get("/profile", UserController_1.default.getMyProfile);
router.post("/invites", UserController_1.default.sendFriendInvite);
router.delete("/invites", UserController_1.default.deleteFriendInvite);
router.get("/friends", UserController_1.default.getListFriends);
router.get("/email/:email", UserController_1.default.getUserByEmail);
router.get("/:id", UserController_1.default.getUserById);
exports.default = router;
