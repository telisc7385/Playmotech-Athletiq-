import { Request, Response } from "express";
import { successResponse, createdResponse } from "../utils/response";
import * as sessionService from "../services/session.service";
import { AppError } from "../core/appError";

export const analyze = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("Image file is required", 400);
  }

  const imagePath = `/uploads/${req.file.filename}`;

  const session = await sessionService.analyzeSession(
    req.user!.userId,
    imagePath
  );
  createdResponse(res, session, "Analysis complete");
};

export const getAll = async (req: Request, res: Response) => {
  const sessions = await sessionService.getUserSessions(req.user!.userId);
  successResponse(res, sessions, "Sessions fetched");
};

export const getById = async (req: Request, res: Response) => {
  const session = await sessionService.getSessionDetail(
    req.params.id as string,
    req.user!.userId
  );
  successResponse(res, session, "Session details fetched");
};
