import { Request } from "express";

export const getLocationFromRequest = (req: Request): string | undefined => {
  const file = req.file as any;
  let url;
  if (file) {
    url = file["location"] as string;
  }
  return url;
};
