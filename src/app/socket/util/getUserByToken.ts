import firebaseAdmin from "../../../infrastructure/firebase";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import { IUser } from "../../entities/User";
export default async (token: string): Promise<IUser> => {
  const decodeValue = await firebaseAdmin
    .auth()
    .verifyIdToken(token.split(" ")[1]);
  if (!decodeValue) throw new Error("Token invalid");

  let user = await UserRepository.getOneByIdProvider(decodeValue.uid);
  if (!user) throw new Error("User not found");
  return user;
};
