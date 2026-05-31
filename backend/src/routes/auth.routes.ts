import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validateRequest.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/me", authenticate, getMe);

export default router;
