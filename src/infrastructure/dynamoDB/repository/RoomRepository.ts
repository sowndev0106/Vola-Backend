import dynamoDB from "..";
import { IRoom } from "../../../app/entities/Room";
import Repository from "./Repository";
const tableName = "rooms";

class RoomRepository extends Repository<IRoom> {
  constructor() {
    super(tableName);
  }
  async getRoomByUser(user: string) {
    const params = {
      TableName: tableName,
      ExpressionAttributeValues: {
        ":id": { id: user, lastMessageRead: "" },
      },
      FilterExpression: `contains (users, :id)`,
    };
    console.log(params);
    const { Items } = await dynamoDB.scan(params).promise();
    return Items ? (Items as IRoom[]) : null;
  }
}
export default new RoomRepository();
