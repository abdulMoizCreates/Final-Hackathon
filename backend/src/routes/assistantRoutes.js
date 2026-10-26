import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  chat,
  getStatus,
  resetSession,
} from "../controllers/assistantController.js";

// /status stays public so the UI can show whether the assistant is
// configured. Chat and reset are gated: AI usage is for signed-in members,
// and both routes need req.user for per-user history + rate limits.
const router = Router();

router.get("/status", getStatus);
router.post("/chat", auth, chat);
router.post("/reset", auth, resetSession);

export default router;
