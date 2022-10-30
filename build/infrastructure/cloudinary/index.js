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
const cloudinary_1 = __importDefault(require("cloudinary"));
const uuid_1 = require("uuid");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const logger_1 = __importDefault(require("../logger"));
cloudinary_1.default.v2.config({
    cloud_name: "secondhandbooks",
    api_key: "777856661377767",
    api_secret: "e1K2-KyHyQXs8otzNZf0ol1atVU",
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        // async code using `req` and `file`
        // ...
        logger_1.default.info(`Insert successfully file ${file.filename} cloundynary`);
        console.log(file.originalname.split("."));
        const extension = file.originalname.split(".").pop();
        const fileName = `${(0, uuid_1.v4)()}`;
        return {
            folder: "volo",
            format: extension,
            resource_type: "auto",
            public_id: fileName,
        };
    }),
});
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
