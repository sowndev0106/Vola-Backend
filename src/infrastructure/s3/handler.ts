import AWS from "aws-sdk";
import logger from "../logger";
const bucketName = process.env.AWS_BUCKETS_S3_NAME as string;
var s3 = new AWS.S3();
export const deleteFileS3ByLink = async (linkFile?: string) => {
  try {
    if (!linkFile) return;
    const fileName = linkFile.split("/").pop() as string;
    await s3.deleteObject({ Bucket: bucketName, Key: fileName }).promise();
    logger.warn("delete file success " + fileName);
  } catch (error) {
    logger.error(error);
  }
};
