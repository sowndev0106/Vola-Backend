"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (text) => {
    if (!text || !text.trim())
        throw new Error(`text is invalid`);
    return text;
};
