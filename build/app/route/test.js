"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handlerOutsite_1 = require("../socket/handlerOutsite");
const router = (0, express_1.Router)();
router.get("/socket/invite", (req, res) => {
    const { userId, data } = req.query;
    (0, handlerOutsite_1.sendFriendInviteSocket)({ data }, userId);
    return res.send("ok");
});
exports.default = router;
