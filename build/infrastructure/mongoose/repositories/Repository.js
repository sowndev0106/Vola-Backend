"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Repository {
    constructor(model) {
        this._model = model;
    }
    add(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = entity;
            const result = yield this._model.create(doc);
            return result;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._model.deleteOne({ _id: id });
            return id;
        });
    }
    update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = entity;
            let doc = yield this._model.updateOne({ _id: _id }, entity).exec();
            return entity;
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let doc = yield this._model.findOne({ _id: id }).exec();
            if (doc === null)
                return null;
            return doc;
        });
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            let docs = yield this._model.find().exec();
            return docs;
        });
    }
}
exports.default = Repository;
