import { AppError } from "../core/appError";
import { chatWithContextStream } from "../utils/gemini";
import { parseChatResponse } from "../utils/jsonValidator";
import { buildChatPrompt } from "../prompts/chat.prompt";
import * as chatRepo from "../repositories/chat.repository";
import * as sessionRepo from "../repositories/session.repository";
import * as authRepo from "../repositories/auth.repository";

export const sendMessageStream = async (
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

  let fullAnswer = "";

  const stream = (async function* () {
    for await (const chunk of chatWithContextStream(prompt)) {
      fullAnswer += chunk;
      yield chunk;
    }
  })();

  const save = async () => {
    const response = parseChatResponse(fullAnswer);
    return chatRepo.createMessage({
      sessionId,
      userId,
      question,
      answer: response.answer,
      drillSuggestion: response.drillSuggestion,
    });
  };

  return { stream, save };
};
