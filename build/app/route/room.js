"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoomController_1 = __importDefault(require("../controllers/RoomController"));
const router = (0, express_1.Router)();
router.get("/users/:userId", RoomController_1.default.getPrivateRoomByUser);
router.get("/", RoomController_1.default.getMyRooms);
router.post("/", RoomController_1.default.createGroupRoomByUser);
router.get("/search", RoomController_1.default.searchRoom);
router.get("/:roomId/messages", RoomController_1.default.getMesageByGroup);
router.put("/:roomId/users/:userId", RoomController_1.default.addUserIntoRoom);
exports.default = router;
