import { AppError } from "../core/appError";
import { analyzeImageWithPrompt } from "../utils/gemini";
import { parseCoachingReport } from "../utils/jsonValidator";
import { buildCoachPrompt } from "../prompts/coach.prompt";
import * as sessionRepo from "../repositories/session.repository";
import * as authRepo from "../repositories/auth.repository";

export const analyzeSession = async (
  userId: string,
  imagePath: string
) => {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const prompt = buildCoachPrompt({
    name: user.fullName,
    role: user.role,
    experience: user.experienceLevel,
  });

  const rawText = await analyzeImageWithPrompt(imagePath, prompt);
  const report = parseCoachingReport(rawText);

  const session = await sessionRepo.createSession({
    userId,
    imagePath: imagePath.replace(/\\/g, "/"),
    overallScore: report.overallScore,
    strengths: report.strengths,
    areasToImprove: report.areasToImprove,
    priorityFix: report.priorityFix,
    drillSuggestion: report.drillSuggestion,
    confidenceLevel: report.confidenceLevel,
    rawResponse: report,
  });

  return session;
};

export const getUserSessions = async (userId: string) => {
  return sessionRepo.findSessionsByUserId(userId);
};

export const getSessionDetail = async (sessionId: string, userId: string) => {
  const session = await sessionRepo.getSessionWithChat(sessionId);
  if (!session) {
    throw new AppError("Session not found", 404);
  }
  if (session.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }
  return session;
};
