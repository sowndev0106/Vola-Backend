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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const uuid_1 = require("uuid");
class Repository {
    constructor(tableName) {
        this.tableName = tableName;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
            };
            const data = yield __1.default.scan(params).promise();
            return data.Items;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: { id },
            };
            const { Item } = yield __1.default.get(params).promise();
            return Item;
        });
    }
    addOrUpdateOne(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const e = entity;
            if (!e.id) {
                e.id = (0, uuid_1.v4)();
            }
            const params = {
                TableName: this.tableName,
                Item: e,
            };
            console.log(params);
            const data = yield __1.default.put(params).promise();
            return entity;
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    id,
                },
            };
            const result = yield __1.default.delete(params).promise();
            return result;
        });
    }
}
exports.default = Repository;
