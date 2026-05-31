import jwt from "jsonwebtoken";
import { envConfig } from "../config/env";

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, envConfig.jwtSecret, { expiresIn: "7d" });
};
