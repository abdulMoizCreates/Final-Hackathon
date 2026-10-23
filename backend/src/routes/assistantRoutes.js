import { Router } from "express";
import {
  chat,
  getStatus,
  resetSession,
} from "../controllers/assistantController.js";

// Public on purpose: the chat widget is available to every visitor of the
// website. If your final product needs gated AI, add the auth middleware here.
const router = Router();

router.get("/status", getStatus);
router.post("/chat", chat);
router.post("/reset", resetSession);

export default router;
