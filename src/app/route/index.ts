import { Router } from "express";
import authenticate from "../middleware/authenticate";
import handlerError from "../middleware/handlerError";
import userRoute from "./user";
import roomRoute from "./room";
import storageRoute from "./storage";
import authRoute from "./auth";
import testRoute from "./test";

const router = Router();

router.use("/auth", authRoute);
router.use("/test", testRoute);
router.use(authenticate);

router.use("/storages", storageRoute);
router.use("/users", userRoute);
router.use("/rooms", roomRoute);

router.use("/error", () => {
  throw new Error("loi ne ");
});

// collect error
router.use(handlerError);

export default router;
