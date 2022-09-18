import dynamoDB from "..";
import { v4 as uuidv4 } from "uuid";
import test from "node:test";

export default abstract class Repository<E> {
  private tableName: string;
  constructor(tableName: string) {
    this.tableName = tableName;
  }
  async getAll(): Promise<E[]> {
    const params = {
      TableName: this.tableName,
    };
    const data = await dynamoDB.scan(params).promise();
    return data.Items as E[];
  }
  async getById(id: string) {
    const params = {
      TableName: this.tableName,
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
    const params = {
      TableName: this.tableName,
      Item: e,
    };
    console.log(params);
    const data = await dynamoDB.put(params).promise();
    return entity;
  }
  async deleteById(id: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };
    const result = await dynamoDB.delete(params).promise();
    return result;
  }
}
