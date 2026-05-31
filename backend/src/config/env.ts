import dotenv from "dotenv";

dotenv.config();

interface EnvConfigPayload {
  port: string;
  dbUrl: string;
  jwtSecret: string;
  geminiKey: string;
  geminiModel: string;
}

export const envConfig: EnvConfigPayload = {
  port: process.env.PORT || "5000",
  dbUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  geminiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
};
