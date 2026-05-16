import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export const authorizeRole =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized access", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden access", 403));
    }

    next();
  };
