"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoomController_1 = __importDefault(require("../controllers/RoomController"));
const s3_1 = __importDefault(require("..//..//infrastructure/s3"));
const router = (0, express_1.Router)();
router.get("/users/:userId", RoomController_1.default.getPrivateRoomByUser);
router.get("/", RoomController_1.default.getMyRooms);
router.post("/", s3_1.default.single("avatar"), RoomController_1.default.createGroupRoomByUser);
router.get("/search", RoomController_1.default.searchRoom);
router.get("/:roomId/messages", RoomController_1.default.getMesageByGroup);
router.put("/:roomId/users/:userId", RoomController_1.default.addUserIntoRoom);
router.delete("/:roomId/users/:userId", RoomController_1.default.removeUserFromRoom);
router.put("/:roomId", s3_1.default.single("avatar"), RoomController_1.default.createGroupRoomByUser);
exports.default = router;
