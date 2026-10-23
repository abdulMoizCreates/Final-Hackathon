# Hackathon Starter Kit

Full-stack authentication starter with **Next.js** (frontend) and **Express** (backend) using JWT auth and MongoDB — plus an **AI assistant powered directly by the Gemini API** with ChatGPT-style streaming responses. Pure JavaScript — **no Python involved**.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Query, Axios
- **Backend:** Express (ES modules), Mongoose, JWT (access + refresh tokens), bcryptjs
- **AI:** Gemini API via the official `@google/genai` SDK, streamed token-by-token through `/api/assistant`

## Project Structure

```
stater-code/
├── frontend/                    # Next.js app
│   └── src/
│       ├── api/                 # React Query hooks, auth.ts, assistant.ts (SSE stream client)
│       ├── app/                 # Pages (login, register, dashboard)
│       ├── components/          # ProtectedRoute, chat/ChatWidget (floating AI chat)
│       ├── context/             # AuthContext
│       └── lib/                 # Axios instance with interceptors
├── backend/                     # Express API
│   ├── site-context.md          # Knowledge base the AI answers from (edit on hackathon day!)
│   └── src/
│       ├── config/              # db.js (MongoDB) + gemini.js (Gemini client & system prompt)
│       ├── controllers/         # authController + assistantController (streams Gemini replies)
│       ├── middlewares/         # JWT auth middleware
│       ├── models/              # Mongoose User model
│       ├── routes/              # authRoutes + assistantRoutes
│       └── utils/               # Token generation helpers
```

## Prerequisites

- **Node.js** >= 20.19
- **pnpm** (frontend) and **npm** (backend)
- **MongoDB** running locally or a remote URI
- A **Gemini API key** — get one free at https://aistudio.google.com/apikey

## Getting Started

### 1. Clone and install

```bash
# Backend
cd backend
cp .env.example .env    # then edit .env with your values
npm install

# Frontend
cd ../frontend
cp .env.example .env.local   # then edit if needed
pnpm install
```

### 2. Configure environment variables

**backend/.env**

| Variable             | Description                                       | Default                                       |
| -------------------- | ------------------------------------------------- | --------------------------------------------- |
| `MONGO_URI`          | MongoDB connection string                         | `mongodb://localhost:27017/hackathon-starter` |
| `JWT_SECRET`         | Secret for access tokens                          | —                                             |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens                         | —                                             |
| `PORT`               | Server port                                       | `5001`                                        |
| `CLIENT_ORIGIN`      | Allowed CORS origin                               | `http://localhost:3000`                       |
| `GEMINI_API_KEY`     | Gemini API key for the AI assistant               | —                                             |
| `GEMINI_MODEL`       | Any Gemini API model id                           | `gemini-3.8-flash`                            |

**frontend/.env.local**

| Variable              | Description     | Default                     |
| --------------------- | --------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5001/api` |

### 3. Run the app

```bash
# Terminal 1 — Backend (uses Node.js watch mode for hot reload)
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
pnpm dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Auth Flow

1. **Register/Login** — Backend returns an access token (15 min) and a refresh token (7 days)
2. **Authenticated requests** — Axios interceptor attaches the access token to every request
3. **Token refresh** — On a 401 response, the interceptor automatically calls `/auth/refresh` to get a new access token
4. **Logout** — Clears tokens from localStorage and invalidates the refresh token on the server

## AI Assistant (Gemini API, streamed)

A floating 💬 chat widget (`ChatWidget`) is mounted in the root layout, so it appears on every page. The request flow is:

```
ChatWidget (Next.js)
  → POST /api/assistant/chat          (Express, Server-Sent Events)
    → generateContentStream           (Gemini API via @google/genai)
      → tokens stream back into the bubble live, ChatGPT-style
```

- **Streaming:** the backend streams every Gemini token as an SSE `delta` event; the widget renders tokens as they arrive (typing dots until the first token, then a blinking cursor). Try asking *"What is JavaScript?"* just like your trainer's demo.
- **Multi-turn memory:** chat history is kept in memory per browser session (last 24 turns), so follow-up questions keep context. `POST /api/assistant/reset` (or the ↺ button in the widget) clears it.
- **Knowledge base:** `backend/site-context.md` is injected into the model's system prompt on startup. **On hackathon day, fill in that file with your project's name, pitch, features and flows — then restart the backend.** The assistant will answer questions about *your actual site*.
- **Model:** any Gemini API model id works — set `GEMINI_MODEL` in `backend/.env` (e.g. to the model your trainer used). Defaults to `gemini-3.8-flash`.
- **API key safety:** the key lives only in `backend/.env` and is used server-side; nothing sensitive ships to the browser.
- **Offline behavior:** if `GEMINI_API_KEY` is missing, `/assistant/status` reports offline (widget header shows "Demo mode") and `/chat` returns a helpful error message instead of an answer.

## API Endpoints

All routes are prefixed with `/api`.

| Method | Route               | Auth            | Description                                   |
| ------ | ------------------- | --------------- | --------------------------------------------- |
| POST   | `/auth/register`    | No              | Create a new account                          |
| POST   | `/auth/login`       | No              | Login with credentials                        |
| POST   | `/auth/refresh`     | No              | Get a new access token                        |
| POST   | `/auth/logout`      | Yes             | Invalidate refresh token                      |
| GET    | `/auth/me`          | Yes             | Get current user info                         |
| GET    | `/assistant/status` | No              | Is the AI configured? Which model?            |
| POST   | `/assistant/chat`   | No              | Send a chat message (SSE streamed reply)      |
| POST   | `/assistant/reset`  | No              | Clear a session's chat history                |
| GET    | `/health`           | No              | Health check (`/api/health`)                  |

## Pages

| Route        | Description                                |
| ------------ | ------------------------------------------ |
| `/`          | Home page with login/register links        |
| `/login`     | Login form                                 |
| `/register`  | Registration form with password confirm    |
| `/dashboard` | Protected page — shows user info + logout  |
