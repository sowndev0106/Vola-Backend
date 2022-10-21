"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (id) => {
    const regexMongoId = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    if (!id || !regexMongoId.test(id))
        throw new Error(`mongo id is invalid`);
    return id;
};
