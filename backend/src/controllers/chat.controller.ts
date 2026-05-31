import { Request, Response } from "express";
import { successResponse } from "../utils/response";
import * as chatService from "../services/chat.service";
import { AppError } from "../core/appError";

export const sendMessage = async (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    throw new AppError("Question is required", 400);
  }

  const sessionId = req.params.sessionId as string;

  const message = await chatService.sendMessage(
    sessionId,
    req.user!.userId,
    question
  );
  successResponse(res, message, "Response received");
};
