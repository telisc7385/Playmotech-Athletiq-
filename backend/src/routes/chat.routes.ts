import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/:sessionId", authenticate, sendMessage);

export default router;
