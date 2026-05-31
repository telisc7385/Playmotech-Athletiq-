# Ghost Coach — AI-Powered Cricket Coaching Assistant

A take-home engineering assignment for Playmotech. Players upload a photo of their cricket stance and receive structured, AI-generated coaching feedback.

## Features

1. **Player Registration & Auth** — JWT-based signup/login with sport, role, and experience level
2. **Stance Upload & AI Feedback** — Upload a photo → Gemini Vision analyzes it → returns score, strengths, areas to improve, priority fix, drill suggestion
3. **Session History** — Browse all past sessions with thumbnails, scores, and expandable coaching reports
4. **AI Improvement Chat** — Context-aware follow-up chat with streaming responses (SSE)
5. **Progress Dashboard** — Score trend chart, session stats, and improvement tracking

## Tech Stack

| Layer    | Technology                               |
| -------- | ---------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend  | Node.js, Express 5, TypeScript           |
| Database | PostgreSQL, Prisma ORM                   |
| Auth     | JWT (bcryptjs + jsonwebtoken)            |
| AI       | Google Gemini 2.5 Flash Vision API       |
| Storage  | Local filesystem (`/uploads`)            |
| Charts   | Recharts                                 |

## Quick Start

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** running locally
- **Google Gemini API Key** (free from [aistudio.google.com](https://aistudio.google.com))

### 1. Clone and install

```bash
# Backend
cd backend
cp .env.example .env   # then edit with your values
npm install
npx prisma migrate dev --name init

# Frontend
cd ../frontend
npm install
```

### 2. Configure `.env`

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/Playmotech"
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"
```

### 3. Run

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend
npm run dev
```

Open `http://localhost:3000`, register a player account, and upload a photo.

## Architecture

```
frontend/                 backend/
  src/                      src/
    pages/                    controllers/     ← Request handling
    components/               services/        ← Business logic
    context/                  repositories/    ← Data access (Prisma)
    api/                      middleware/      ← Auth, validation, upload
                              utils/           ← Gemini, JSON parsing
                              prompts/         ← AI prompt templates
```

**Backend pattern**: Controller → Service → Repository. Controllers handle HTTP, services contain business logic, repositories abstract Prisma queries. This keeps the code testable and easy to navigate.

**Frontend pattern**: Pages use `useState`/`useEffect` for local state, `AuthContext` for global auth state, and Axios with interceptors for API calls. Streaming chat uses raw `fetch` with SSE parsing.

## AI Prompt Design

### Image Analysis Prompt

The coaching prompt includes the player's name, role, and experience level so the AI personalizes feedback. It asks for structured JSON output with:

- `overallScore` (0-10)
- `strengths` (2-3 items)
- `areasToImprove` (2-3 items)
- `priorityFix` (single most important correction)
- `drillSuggestion` (one concrete exercise)
- `confidenceLevel` (Low/Medium/High)

The prompt enforces plain-English explanations suitable for teenagers, bans hallucinated observations, and explicitly scopes the analysis to visible evidence in the single uploaded image.

### Chat Prompt

The chat prompt passes the player's profile + the previous coaching report so the AI has full session context. It returns JSON with `answer` and `drillSuggestion`. The response is streamed word-by-word to the frontend via SSE after the full Gemini response is parsed — this avoids showing raw JSON wrappers during streaming.

## API Endpoints

| Method | Endpoint                | Auth | Description                  |
| ------ | ----------------------- | ---- | ---------------------------- |
| POST   | `/api/auth/register`    | No   | Create account               |
| POST   | `/api/auth/login`       | No   | Sign in                      |
| GET    | `/api/auth/me`          | Yes  | Get profile                  |
| POST   | `/api/sessions/analyze` | Yes  | Upload photo + AI analysis   |
| GET    | `/api/sessions`         | Yes  | List all sessions            |
| GET    | `/api/sessions/:id`     | Yes  | Session details + chat       |
| POST   | `/api/chat/:sessionId`  | Yes  | Send message (SSE streaming) |
| GET    | `/api/dashboard/stats`  | Yes  | Dashboard stats + scores     |

## Known Limitations

- **Single image only** — A single photo can't capture timing, foot movement, or follow-through. Video analysis would be more accurate.
- **Local file storage** — Uploads are stored on disk. For production, use S3 or Cloudinary.
- **Gemini free tier** — Rate-limited and may have higher latency during peak times.
- **No visual annotations** — The current version doesn't draw on the image to highlight body parts. This would improve clarity.
- **Single sport** — Cricket only. The prompts and schema are cricket-specific.

## Submission Checklist

- [x] Player registration & authentication
- [x] Stance upload & AI feedback
- [x] Session history
- [x] AI improvement chat (streaming)
- [x] Progress dashboard with charts
- [x] Environment variables via `.env` (no hardcoded keys)
- [x] README with setup, architecture, and decisions

## Screenshots

![Dashboard — stats, score chart, and improvement tracking](screenshots/dashboard.png)
![Upload & AI analysis — drag-and-drop dropzone with coaching report](screenshots/upload-analysis.png)
![Session history — card grid with thumbnails and score badges](screenshots/session-history.png)
![AI improvement chat — streaming SSE chat with coaching context](screenshots/ai-chat.png)
