import dynamoDB from "..";
import { IFriend, StatusFriend } from "../../../app/entities/Friend";
import Repository from "./Repository";
const tableName = "Friends";

class FriendRepository extends Repository<IFriend> {
  constructor() {
    super(tableName);
  }
  async getRequestFriendSend(user: string) {
    const params = {
      TableName: tableName,
      ExpressionAttributeValues: {
        ":userSend": user,
        ":status": StatusFriend.Stranger,
      },
      FilterExpression: "userSend= :userSend and status = :status",
    };
    const { Items } = await dynamoDB.scan(params).promise();
    return Items ? (Items[0] as IFriend) : null;
  }
  async getRequestFriendRecive(user: string) {
    const params = {
      TableName: tableName,
      ExpressionAttributeValues: {
        ":userRecive": user,
        ":status": StatusFriend.Stranger,
      },
      FilterExpression: "userRecive = :userRecive and status = :status",
    };
    const { Items } = await dynamoDB.scan(params).promise();
    return Items ? (Items[0] as IFriend) : null;
  }
  async getFriendsUser(user: string) {
    const params = {
      TableName: tableName,
      ExpressionAttributeValues: {
        ":userRecive": user,
        ":userSend": user,
        ":status": StatusFriend.Accepted,
      },
      FilterExpression:
        "userRecive = :userRecive or userSend= :userSend and status = :status",
    };
    const { Items } = await dynamoDB.scan(params).promise();
    return Items ? (Items as IFriend[]) : null;
  }
  async getFriendUser(user: string, user2: string) {
    const params = {
      TableName: tableName,
      ExpressionAttributeValues: {
        ":userRecive": user,
        ":userSend": user,
        ":status": StatusFriend.Accepted,
      },
      FilterExpression:
        "userRecive = :userRecive or userSend= :userSend and status = :status",
    };
    const { Items } = await dynamoDB.scan(params).promise();
    return Items ? (Items as IFriend[]) : null;
  }
  acceptRequestFriend(userSend: string, userRecive: string) {}
  denyRequestFriend(userSend: string, userRecive: string) {}
  unFriend(user1: string, user2: string) {}
}
export default new FriendRepository();
