"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(messageBag) {
        super('ValidationError');
        this.name = 'ValidationError';
        this._messageBag = messageBag;
    }
    get messageBag() {
        return this._messageBag;
    }
}
exports.default = ValidationError;
