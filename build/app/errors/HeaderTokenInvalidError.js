"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HeaderTokenInvalidError extends Error {
    constructor(message) {
        super(message);
        this.name = 'HeaderTokenInvalidError';
    }
}
exports.default = HeaderTokenInvalidError;
