import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Name must be at least 2 characters",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
  sport: Joi.string().trim().required().messages({
    "string.empty": "Sport is required",
  }),
  role: Joi.string().trim().required().messages({
    "string.empty": "Position / Role is required",
  }),
  experienceLevel: Joi.string()
    .valid("BEGINNER", "INTERMEDIATE", "ADVANCED")
    .required()
    .messages({
      "any.only": "Experience must be Beginner, Intermediate, or Advanced",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});
