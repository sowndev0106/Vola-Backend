import { NextFunction, Request, Response } from "express";
import { TypeMeesage } from "../entities/Room";
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
  async uploadSingleFile(req: Request, res: Response, next: NextFunction) {
    const file = req.file as any;
    if (!file) {
      throw new Error("file is require");
    }
    const url = file["path"] as string;
    const extentionFile = url.split(".").at(-1) as string;
    const type = listExtentionImage.includes(extentionFile)
      ? TypeMeesage.Image
      : TypeMeesage.File;
    res.status(200).json({
      url,
      type,
      size: file.size,
      name: file.key,
    });
  }
  async uploadMultipleFiles(req: Request, res: Response, next: NextFunction) {
    const files = req.files as any;
    console.log(files);
    if (!files) {
      throw new Error("file is require");
    }
    res.json(files);
  }
}
export default new StorageController();
