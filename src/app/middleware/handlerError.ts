import { NextFunction, Request, Response } from "express";
import ValidationError from "../errors/ValidationError";

export default function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error: any = {
    success: false,
    error: err.message,
  };

  switch (err.name) {
    case "UnauthorizedError":
      res.status(401);
      break;

    case "NotFoundError":
      res.status(404);
      break;

    case "HeaderTokenInvalidError":
      res.status(403);
      break;

    case "ValidationError":
      res.status(422);
      error.error = (err as ValidationError).messageBag;
      break;
    default:
      res.status(400);
  }

  return res.json(error);
}
