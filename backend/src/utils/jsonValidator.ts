import { AppError } from "../core/appError";

interface CoachingReport {
  overallScore: number;
  strengths: string[];
  areasToImprove: string[];
  priorityFix: string;
  drillSuggestion: string;
  confidenceLevel: string;
}

interface ChatResponse {
  answer: string;
  drillSuggestion: string;
}

export const parseCoachingReport = (text: string): CoachingReport => {
  try {
    const cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (typeof parsed.overallScore !== "number") {
      parsed.overallScore = 0;
    }
    if (!Array.isArray(parsed.strengths)) {
      parsed.strengths = [];
    }
    if (!Array.isArray(parsed.areasToImprove)) {
      parsed.areasToImprove = [];
    }
    if (typeof parsed.priorityFix !== "string") {
      parsed.priorityFix = "";
    }
    if (typeof parsed.drillSuggestion !== "string") {
      parsed.drillSuggestion = "";
    }
    if (typeof parsed.confidenceLevel !== "string") {
      parsed.confidenceLevel = "Medium";
    }

    return parsed as CoachingReport;
  } catch {
    throw new AppError(
      "Failed to parse AI response. Please try again.",
      502
    );
  }
};

export const parseChatResponse = (text: string): ChatResponse => {
  try {
    const cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      answer: parsed.answer || "",
      drillSuggestion: parsed.drillSuggestion || "",
    };
  } catch {
    throw new AppError(
      "Failed to parse AI chat response. Please try again.",
      502
    );
  }
};
