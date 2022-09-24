import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import firebaseAdmin from "../../../infrastructure/firebase";
import Client, { StatusClient } from "../Client";
export interface IAddUser {
  token: string;
  client: Client;
}
export default async ({ token, client }: IAddUser) => {
  const decodeValue = await firebaseAdmin
    .auth()
    .verifyIdToken(token.split(" ")[1]);
  if (!decodeValue) throw new Error("Token invalid");

  let user = await UserRepository.getOneByIdProvider(decodeValue.uid);
  if (!user) throw new Error("User not found");
  const userId = String(user._id);

  if (client.status == StatusClient.Disconect) return;

  let userDriver = client.socketMain.users.get(userId);

  if (userDriver) {
    userDriver.dirver++;
  } else {
    userDriver = {
      dirver: 1,
      user: user,
    };
  }

  client.socketMain.users.set(userId, userDriver);
  client.status = StatusClient.AsyncUser;

  client.socket.join(userId); // join socket

  client.userId = userId;
};
