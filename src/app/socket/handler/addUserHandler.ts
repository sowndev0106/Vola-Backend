import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import { IUser } from "../../entities/User";
import firebaseAdmin from "..//..//..//infrastructure/firebase";
export default async (users: IUser[], token: string) => {
  const decodeValue = await firebaseAdmin.auth().verifyIdToken(token);
  if (!decodeValue) throw new Error("Token invalid");

  let user = await UserRepository.getOneByIdProvider(decodeValue.uid);
  if (!user) throw new Error("User not found");

  users.push(user);
};
