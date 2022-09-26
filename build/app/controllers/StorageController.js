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
const Room_1 = require("../entities/Room");
const listExtentionImage = [
    "webp",
    "svg",
    "png",
    "jpeg",
    "jpg",
    "avif",
    "apng",
];
class StorageController {
    // [GET] api/storages/upload
    uploadSingleFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                throw new Error("file is require");
            }
            const url = file["location"];
            const extentionFile = url.split(".").at(-1);
            const type = listExtentionImage.includes(extentionFile)
                ? Room_1.TypeMeesage.Image
                : Room_1.TypeMeesage.File;
            res.status(200).json({
                url,
                type,
                size: file.size,
                name: file.key,
            });
        });
    }
}
exports.default = new StorageController();
