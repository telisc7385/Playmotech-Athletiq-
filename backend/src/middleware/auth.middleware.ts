import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../core/appError";
import { envConfig } from "../config/env";

export interface AuthPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, envConfig.jwtSecret) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
};
