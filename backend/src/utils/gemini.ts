import { GoogleGenerativeAI } from "@google/generative-ai";
import { envConfig } from "../config/env";
import { AppError } from "../core/appError";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(envConfig.geminiKey);

const resolvePath = (filePath: string): string => {
  if (filePath.startsWith("/uploads/")) {
    return path.join(process.cwd(), filePath);
  }
  return filePath;
};

export const analyzeImageWithPrompt = async (
  imagePath: string,
  prompt: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: envConfig.geminiModel });

    const fullPath = resolvePath(imagePath);
    const imageData = fs.readFileSync(fullPath);
    const base64Image = imageData.toString("base64");
    const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";

    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType } },
      prompt,
    ]);

    const response = result.response;
    return response.text();
  } catch (error: any) {
    throw new AppError(
      `Gemini API error: ${error.message || "Failed to analyze image"}`,
      502
    );
  }
};

export async function* chatWithContextStream(
  prompt: string
): AsyncGenerator<string> {
  try {
    const model = genAI.getGenerativeModel({ model: envConfig.geminiModel });
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  } catch (error: any) {
    throw new AppError(
      `Gemini API error: ${error.message || "Failed to stream response"}`,
      502
    );
  }
}
