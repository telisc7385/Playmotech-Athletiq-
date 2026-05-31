import { Router } from "express";
import { analyze, getAll, getById } from "../controllers/session.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.post("/analyze", authenticate, upload.single("image"), analyze);
router.get("/", authenticate, getAll);
router.get("/:id", authenticate, getById);

export default router;
