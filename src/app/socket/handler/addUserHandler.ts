import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import { IUser } from "../../entities/User";
import firebaseAdmin from "../../../infrastructure/firebase";
import SocketMain from "..";
export default async (socketMain: SocketMain, token: string) => {
  const decodeValue = await firebaseAdmin
    .auth()
    .verifyIdToken(token.split(" ")[1]);
  if (!decodeValue) throw new Error("Token invalid");

  let user = await UserRepository.getOneByIdProvider(decodeValue.uid);

  if (!user) throw new Error("User not found");

  socketMain.users.set(user._id as string, user);
};
