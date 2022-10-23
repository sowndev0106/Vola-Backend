import multerS3 from "multer-s3";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import logger from "..//logger";
import { v4 as uuidv4 } from "uuid";
const maxSize = 1024 * 1024 * 10; // 10MB
const bucketName = process.env.AWS_BUCKETS_S3_NAME as string;
// connect AWS
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION,
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: bucketName,
    key: function (req, file, cb) {
      logger.info(`Insert successfully  file ${file.filename}`);
      const fileName = `${uuidv4()}.${file.mimetype.split("/")[1]}`;
      cb(null, fileName); //use Date.now() for unique file keys
    },
  }),
  limits: { fileSize: maxSize },
});

export default upload;
