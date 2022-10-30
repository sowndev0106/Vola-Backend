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
exports.deleteFileS3ByLink = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const logger_1 = __importDefault(require("../logger"));
const bucketName = process.env.AWS_BUCKETS_S3_NAME;
var s3 = new aws_sdk_1.default.S3();
const deleteFileS3ByLink = (linkFile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!linkFile)
            return;
        const fileName = linkFile.split("/").pop();
        yield s3.deleteObject({ Bucket: bucketName, Key: fileName }).promise();
        logger_1.default.warn("delete file success " + fileName);
    }
    catch (error) {
        logger_1.default.error(error);
    }
});
exports.deleteFileS3ByLink = deleteFileS3ByLink;
