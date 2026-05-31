import bcrypt from "bcryptjs";
import { AppError } from "../core/appError";
import { generateToken } from "../utils/jwt";
import * as authRepo from "../repositories/auth.repository";

export const registerUser = async (data: {
  fullName: string;
  email: string;
  password: string;
  sport: string;
  role: string;
  experienceLevel: string;
}) => {
  const existing = await authRepo.findUserByEmail(data.email);
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await authRepo.createUser({
    ...data,
    password: hashedPassword,
  });

  const token = generateToken({ userId: user.id, email: user.email });

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      sport: user.sport,
      role: user.role,
      experienceLevel: user.experienceLevel,
      createdAt: user.createdAt,
    },
    token,
  };
};

export const getProfile = async (userId: string) => {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
