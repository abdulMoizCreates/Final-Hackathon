# Hackathon Starter Kit

Full-stack authentication starter with **Next.js** (frontend) and **Express** (backend) using JWT auth and MongoDB.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Query, Axios
- **Backend:** Express (ES modules), Mongoose, JWT (access + refresh tokens), bcryptjs

## Project Structure

```
stater-code/
├── frontend/                # Next.js app
│   └── src/
│       ├── api/             # React Query hooks & API functions
│       ├── app/             # Pages (login, register, dashboard)
│       ├── components/      # ProtectedRoute
│       ├── context/         # AuthContext
│       └── lib/             # Axios instance with interceptors
├── backend/                 # Express API
│   └── src/
│       ├── config/          # MongoDB connection
│       ├── controllers/     # Auth controller (register, login, logout, refresh, me)
│       ├── middlewares/      # JWT auth middleware
│       ├── models/          # Mongoose User model
│       ├── routes/          # Auth routes
│       └── utils/           # Token generation helpers
```

## Prerequisites

- **Node.js** >= 20.19
- **pnpm** (frontend) and **npm** (backend)
- **MongoDB** running locally or a remote URI

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

| Variable             | Description                        | Default                                      |
| -------------------- | ---------------------------------- | -------------------------------------------- |
| `MONGO_URI`          | MongoDB connection string          | `mongodb://localhost:27017/hackathon-starter` |
| `JWT_SECRET`         | Secret for access tokens           | —                                            |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens          | —                                            |
| `PORT`               | Server port                        | `5001`                                       |
| `CLIENT_ORIGIN`      | Allowed CORS origin                | `http://localhost:3000`                       |

**frontend/.env.local**

| Variable             | Description       | Default                        |
| -------------------- | ----------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL`| Backend API URL   | `http://localhost:5001/api`    |

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

## API Endpoints

All routes are prefixed with `/api/auth`.

| Method | Route       | Auth | Description              |
| ------ | ----------- | ---- | ------------------------ |
| POST   | `/register` | No   | Create a new account     |
| POST   | `/login`    | No   | Login with credentials   |
| POST   | `/refresh`  | No   | Get a new access token   |
| POST   | `/logout`   | Yes  | Invalidate refresh token |
| GET    | `/me`       | Yes  | Get current user info    |
| GET    | `/health`   | No   | Health check (`/api/health`) |

## Pages

| Route        | Description                                |
| ------------ | ------------------------------------------ |
| `/`          | Home page with login/register links        |
| `/login`     | Login form                                 |
| `/register`  | Registration form with password confirm    |
| `/dashboard` | Protected page — shows user info + logout  |
