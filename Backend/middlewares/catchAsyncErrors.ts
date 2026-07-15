import { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export default (controllerFunction: AsyncController) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(controllerFunction(req, res, next)).catch(next);
