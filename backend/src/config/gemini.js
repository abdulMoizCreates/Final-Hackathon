import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const SITE_CONTEXT_PATH = path.join(MODULE_DIR, "../../site-context.md");

/**
 * Model used for chat responses. Override GEMINI_MODEL in .env with any valid
 * Gemini API model id (e.g. the one your trainer used).
 */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

function loadSiteContext() {
  try {
    return fs.readFileSync(SITE_CONTEXT_PATH, "utf8");
  } catch {
    return "";
  }
}

/**
 * The system prompt injects backend/site-context.md so the assistant answers
 * questions about *this* website. Edit that file on hackathon day, then
 * restart the backend.
 */
export const SYSTEM_INSTRUCTION = `You are the friendly on-site AI assistant embedded in a website.

Your job is to answer visitor questions about the website: what it does, what
problems it solves, which features exist, how to use it, and the tech stack
behind it.

Rules:
- Answer from the WEBSITE CONTEXT below and the conversation so far. If
  something is not covered there, say so honestly instead of inventing it.
- Be concise and friendly. Prefer short paragraphs or bullet lists.
- The website is built during a hackathon and evolves fast; describe missing
  or unfinished things as "coming soon" rather than guessing details.

WEBSITE CONTEXT
---
${loadSiteContext()}
---`;

let _client = null;

/**
 * Lazily creates the Gemini client so importing this module never throws
 * when GEMINI_API_KEY is missing (e.g. before .env is configured).
 */
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!_client) {
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}
