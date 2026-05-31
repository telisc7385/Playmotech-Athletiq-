import { Request, Response } from "express";
import { successResponse, createdResponse } from "../utils/response";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  createdResponse(res, result, "Registration successful");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  successResponse(res, result, "Login successful");
};

export const getMe = async (req: Request, res: Response) => {
  const user = await authService.getProfile(req.user!.userId);
  successResponse(res, user, "Profile fetched");
};
