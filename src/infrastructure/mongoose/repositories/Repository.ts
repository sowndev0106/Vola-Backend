import { Model, Document } from "mongoose";

export default class Repository<E> {
  private _model: Model<Document, {}>;

  protected constructor(model: Model<Document, {}>) {
    this._model = model;
  }

  async add(entity: E): Promise<E> {
    const doc = entity as any;
    const result = await this._model.create(doc);
    return result as E;
  }

  async delete(id: string): Promise<string> {
    await this._model.deleteOne({ _id: id });
    return id;
  }

  async update(entity: E): Promise<E> {
    const { _id } = entity as any;
    let doc = await this._model.updateOne({ _id: _id }, entity as any).exec();
    return entity;
  }

  async findOneById(id: string): Promise<E | null> {
    let doc = await this._model.findOne({ _id: id }).exec();
    if (doc === null) return null;
    return doc as E;
  }

  async all(): Promise<E[]> {
    let docs = await this._model.find().exec();

    return docs as E[];
  }
}
