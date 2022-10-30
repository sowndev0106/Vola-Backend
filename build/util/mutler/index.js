"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlFromRequest = void 0;
const getUrlFromRequest = (req) => {
    const file = req.file;
    let url;
    if (file) {
        url = file["path"];
    }
    return url;
};
exports.getUrlFromRequest = getUrlFromRequest;
