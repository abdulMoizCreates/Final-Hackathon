import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const SITE_CONTEXT_PATH = path.join(MODULE_DIR, "../../site-context.md");

/**
 * Model used for chat responses. Override GEMINI_MODEL in .env with any valid
 * Gemini API model id (e.g. gemini-3.6-flash or gemini-3.8-flash).
 */
export const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";

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
export const SYSTEM_INSTRUCTION = `You are the helpful, intelligent on-site AI assistant embedded in this website.

Your goal is to answer visitor questions clearly, directly, and helpfully about what this website does, its features, user flows, and tech stack.

Response Formatting Guidelines:
- Format your response cleanly using structured Markdown.
- Use clean headings (###) to separate distinct sections when answering multifaceted questions.
- Use crisp bullet lists (* or -) for feature lists, tech stack items, or key points.
- Bold key terms or titles (**like this**) for scannability.
- Use backticks for code, paths, commands, endpoints, or environment variables (e.g. \`/api/assistant/chat\`).
- Keep paragraphs short (2-3 sentences max) to avoid dense walls of text.
- Be concise, polite, and direct.

Content Guidelines:
- Base answers on the WEBSITE CONTEXT below and the ongoing conversation.
- If a question is outside the scope of this website, politely state that you focus on this site's details.
- For features that are missing or planned, describe them cleanly as "coming soon" rather than guessing.

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
