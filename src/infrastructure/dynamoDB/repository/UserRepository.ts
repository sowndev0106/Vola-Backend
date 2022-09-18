import dynamoDB from "..";
import { IUser } from "../../../app/entities/User";
import Repository from "./Repository";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
const tableName = "users";

class UserRepository extends Repository<IUser> {
  constructor() {
    super(tableName);
  }
  async getOneByIdProvider(idProvider: string): Promise<IUser | null> {
    const params = {
      TableName: tableName,
      ExpressionAttributeValues: { ":idProvider": idProvider },
      FilterExpression: "idProvider = :idProvider",
    };
    const { Items } = await dynamoDB.scan(params).promise();
    return Items ? (Items[0] as IUser) : null;
  }
}
export default new UserRepository();
