"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_s3_1 = __importDefault(require("multer-s3"));
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const logger_1 = __importDefault(require("..//logger"));
const uuid_1 = require("uuid");
const maxSize = 1024 * 1024 * 10; // 10MB
// connect AWS
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});
var upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        acl: "public-read",
        bucket: process.env.AWS_BUCKETS_S3_NAME,
        key: function (req, file, cb) {
            logger_1.default.info(`Insert successfully  file ${file.filename}`);
            const fileName = `${(0, uuid_1.v4)()}.${file.mimetype.split("/")[1]}`;
            cb(null, fileName); //use Date.now() for unique file keys
        },
    }),
    limits: { fileSize: maxSize },
});
exports.default = upload;
