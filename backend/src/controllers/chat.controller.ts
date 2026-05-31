import { Request, Response } from "express";
import * as chatService from "../services/chat.service";
import { AppError } from "../core/appError";

export const sendMessage = async (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    throw new AppError("Question is required", 400);
  }

  const sessionId = req.params.sessionId as string;

  const { stream, save } = await chatService.sendMessageStream(
    sessionId,
    req.user!.userId,
    question
  );

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ token: chunk })}\n\n`);
    }

    const saved = await save();
    res.write(`data: ${JSON.stringify({ done: true, message: saved })}\n\n`);
  } catch (error: any) {
    res.write(
      `data: ${JSON.stringify({ error: error.message || "Stream failed" })}\n\n`
    );
  } finally {
    res.end();
  }
};
