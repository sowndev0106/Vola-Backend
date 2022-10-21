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
class CollectErrors {
    constructor() {
        this._errors = {};
    }
    get errors() {
        return this._errors;
    }
    collect(tag, method) {
        try {
            return method();
        }
        catch (error) {
            this._errors[tag] = error.message;
        }
    }
    collectAsync(tag, method) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield method();
            }
            catch (error) {
                this._errors[tag] = error.message;
            }
        });
    }
    clear() {
        this._errors = {};
    }
    hasError() {
        return Object.keys(this._errors).length > 0;
    }
}
exports.default = CollectErrors;
