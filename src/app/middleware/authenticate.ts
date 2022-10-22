import { NextFunction, Request, Response } from "express";
import UserRepository from "../../infrastructure/mongoose/repositories/UserRepository";
import firebaseAdmin from "..//..//infrastructure/firebase";
import HeaderTokenInvalidError from "../errors/HeaderTokenInvalidError";

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1] as string;
  if (!token) {
    throw new HeaderTokenInvalidError("authorization token is required");
  }
  try {
    const decodeValue = await firebaseAdmin.auth().verifyIdToken(token);
    if (!decodeValue) {
      throw new Error();
    }
    const { name, uid, picture, firebase, email } = decodeValue as any;
    let user = await UserRepository.getOneByIdProvider(decodeValue.uid);

    if (!user) {
      // create new user
      user = await UserRepository.add({
        idProvider: uid,
        name: name,
        avatar: picture,
        provider: firebase["sign_in_provider"],
        email: email,
      });
    }
    req.headers.userId = user._id;
    return next();
  } catch (error) {
    console.log(error);
    throw new HeaderTokenInvalidError("authorization token invalid");
  }
};
