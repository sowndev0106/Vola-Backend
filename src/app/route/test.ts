import { Router } from "express";
import StorageController from "../controllers/StorageController";
import s3 from "..//..//infrastructure/s3";
import { request } from "http";
import { sendFriendInviteSocket } from "../socket/handlerOutsite";
const router = Router();
router.get("/socket/invite", (req, res) => {
    const { userId, data } = req.query;
    sendFriendInviteSocket({ data }, userId as string);
    return res.send("ok");
});
export default router;
