import cloudinary from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import logger from "../logger";
cloudinary.v2.config({
  cloud_name: "secondhandbooks",
  api_key: "777856661377767",
  api_secret: "e1K2-KyHyQXs8otzNZf0ol1atVU",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,

  params: async (req: any, file: any) => {
    // async code using `req` and `file`
    // ...
    logger.info(`Insert successfully file ${file.filename} cloundynary`);
    const extension = file.originalname.split(".").pop();
    const fileName = `${uuidv4()}___${file.originalname.split(".")[0]}`;

    return {
      folder: "volo",
      format: extension,
      resource_type: "auto",
      public_id: fileName,
    };
  },
});

const upload = multer({ storage: storage });

export default upload;
