import SocketMain from "..";
import Client, { StatusClient } from "../Client";

export default (client: Client) => {
  client.status = StatusClient.Disconect;
  const userId = String(client.userId);
  const userDiver = client.socketMain.users.get(userId);
  if (userDiver && userDiver.dirver > 1) {
    // user online in multiple dirver
    userDiver.dirver--;
    client.socketMain.users.set(userId, {
      dirver: userDiver.dirver,
      user: userDiver.user,
    });
  } else {
    // user offline
    client.socketMain.users.delete(userId);
  }
};
