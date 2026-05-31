import { GoogleGenerativeAI } from "@google/generative-ai";
import { envConfig } from "../config/env";
import { AppError } from "../core/appError";
import fs from "fs";

const genAI = new GoogleGenerativeAI(envConfig.geminiKey);

export const analyzeImageWithPrompt = async (
  imagePath: string,
  prompt: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imageData = fs.readFileSync(imagePath);
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

export const chatWithContext = async (
  prompt: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    throw new AppError(
      `Gemini API error: ${error.message || "Failed to get response"}`,
      502
    );
  }
};
