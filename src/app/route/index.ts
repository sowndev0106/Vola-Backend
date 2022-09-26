import { Router } from "express";
import authenticate from "../middleware/authenticate";
import handlerError from "../middleware/handlerError";
import userRoute from "./user";
import roomRoute from "./room";
import storageRoute from "./storage";

const router = Router();
router.use("/storages", storageRoute);
router.use(authenticate);
// collect error
router.use("/users", userRoute);
router.use("/rooms", roomRoute);

router.use("/error", () => {
  throw new Error("loi ne ");
});

router.use(handlerError);

export default router;
