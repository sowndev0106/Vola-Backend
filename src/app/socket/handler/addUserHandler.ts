import Client, { StatusClient } from "../Client";
import getUserByToken from "../util/getUserByToken";
export interface IAddUser {
  token: string;
  client: Client;
}
export default async ({ token, client }: IAddUser) => {
  const user = await getUserByToken(token);
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
