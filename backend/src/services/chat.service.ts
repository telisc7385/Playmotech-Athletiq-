import { AppError } from "../core/appError";
import { chatWithContext } from "../utils/gemini";
import { parseChatResponse } from "../utils/jsonValidator";
import { buildChatPrompt } from "../prompts/chat.prompt";
import * as chatRepo from "../repositories/chat.repository";
import * as sessionRepo from "../repositories/session.repository";
import * as authRepo from "../repositories/auth.repository";

export const sendMessage = async (
  sessionId: string,
  userId: string,
  question: string
) => {
  const session = await sessionRepo.findSessionById(sessionId);
  if (!session) {
    throw new AppError("Session not found", 404);
  }
  if (session.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  const user = await authRepo.findUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const previousReport = JSON.stringify({
    overallScore: session.overallScore,
    strengths: session.strengths,
    areasToImprove: session.areasToImprove,
    priorityFix: session.priorityFix,
    drillSuggestion: session.drillSuggestion,
  });

  const prompt = buildChatPrompt({
    name: user.fullName,
    role: user.role,
    experience: user.experienceLevel,
    previousReport,
    question,
  });

  const rawText = await chatWithContext(prompt);
  const response = parseChatResponse(rawText);

  const message = await chatRepo.createMessage({
    sessionId,
    userId,
    question,
    answer: response.answer,
    drillSuggestion: response.drillSuggestion,
  });

  return message;
};
