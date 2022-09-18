import { Router } from "express";
import UserRepository from "../../infrastructure/dynamoDB/repository/UserRepository";
import authenticate from "../middleware/authenticate";
import handlerError from "../middleware/handlerError";
import userRoute from "./user";

const router = Router();

router.use(authenticate);
// collect error
router.use("/users", userRoute);

router.use("/error", () => {
  throw new Error("loi ne ");
});

router.use(handlerError);

export default router;
