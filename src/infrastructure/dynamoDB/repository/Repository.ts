import dynamoDB from "..";
import { v4 as uuidv4 } from "uuid";
import test from "node:test";

const tableName = "users";
export default abstract class Repository<E> {
  private tableName: string;
  constructor(tableName: string) {
    this.tableName = tableName;
  }
  async getAll(): Promise<E[]> {
    const params = {
      TableName: tableName,
    };
    const data = await dynamoDB.scan(params).promise();
    return data.Items as E[];
  }
  async getById(id: string) {
    const params = {
      TableName: tableName,
      Key: { id },
    };
    const { Item } = await dynamoDB.get(params).promise();
    return Item as E;
  }
  async addOrUpdateOne(entity: E) {
    const e = entity as any;
    if (!e.id) {
      e.id = uuidv4();
    }
    e.test = {
      value: 1,
      value2: "sad",
      test2: {
        test: 3,
      },
    };
    const params = {
      TableName: tableName,
      Item: e,
    };

    const data = await dynamoDB.put(params).promise();
    return entity;
  }
  async deleteById(id: string) {
    const params = {
      TableName: tableName,
      Key: {
        id,
      },
    };
    const result = await dynamoDB.delete(params).promise();
    return result;
  }
}
