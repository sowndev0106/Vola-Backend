import { Request } from "express";

export const getUrlFromRequest = (req: Request): string | undefined => {
  const file = req.file as any;
  let url;
  if (file) {
    url = file["path"] as string;
  }
  return url;
};
