# ⚡ HackGenius AI

<video controls src="../ai_agent_working.mp4" title="Title"></video>

Turn any hackathon problem statement into a complete, judge-ready solution.
Enter a problem and instantly get:

- 🔍 Problem Analysis
- 💡 Proposed Solution
- 🏗️ System Architecture
- 🧰 Recommended Tech Stack
- 🗺️ Implementation Roadmap
- 📊 PPT / Presentation Content
- 🚀 Innovation Highlights

Export any solution as a polished **PDF**, and revisit past generations from the
**History** dashboard.

## 🧱 Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend    | FastAPI, SQLAlchemy 2, Pydantic v2  |
| Database   | PostgreSQL 16                       |
| AI         | Google Gemini (`gemini-1.5-flash`)  |
| PDF        | WeasyPrint                          |
| Deployment | Docker + Docker Compose             |

## 🏛️ Architecture

```
Next.js (3000)  ──REST──▶  FastAPI (8000)  ──▶  PostgreSQL (5432)
                                  │
                                  └──▶  Gemini API (structured JSON)
```

Generation is asynchronous: the API creates a `PENDING` record, runs Gemini in a
background task (`PENDING → PROCESSING → COMPLETED/FAILED`), and the frontend
polls until the solution is ready.

## 📂 Project Structure

```
hackgenius-ai/
├── docker-compose.yml
├── .env.example
├── backend/
│   └── app/
│       ├── api/v1/        # REST routers
│       ├── ai/            # Gemini client, prompts, schema
│       ├── core/          # config, logging, exceptions
│       ├── db/            # engine + session
│       ├── models/        # SQLAlchemy ORM
│       ├── repositories/  # DB access
│       ├── schemas/       # Pydantic DTOs
│       └── services/      # orchestration + PDF
└── frontend/
    └── src/
        ├── app/           # pages (App Router)
        ├── components/    # UI components
        ├── hooks/         # useSolution (polling)
        └── lib/           # API client + types
```

## 🚀 Quick Start (Docker — recommended)

1. **Get a Gemini API key** from https://aistudio.google.com/app/apikey

2. **Configure environment:**

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   Edit `backend/.env` and set `GEMINI_API_KEY`.

3. **Run everything:**

   ```bash
   docker compose up --build
   ```

4. Open:
   - Frontend → http://localhost:3000
   - API docs → http://localhost:8000/docs

> On first boot the backend auto-creates tables. For production, use the
> included Alembic migrations instead (see below).

## 🛠️ Local Development (without Docker)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
cp .env.example .env            # set GEMINI_API_KEY and a local DATABASE_URL
alembic upgrade head            # apply migrations
uvicorn app.main:app --reload
```

> WeasyPrint needs native libs (Pango/Cairo). On Windows the easiest path is
> running the backend via Docker.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🔌 API Reference

| Method   | Endpoint                       | Description                  |
| -------- | ------------------------------ | ---------------------------- |
| `POST`   | `/api/v1/solutions`            | Create + trigger generation  |
| `GET`    | `/api/v1/solutions`            | List solutions (paginated)   |
| `GET`    | `/api/v1/solutions/{id}`       | Get one (poll status)        |
| `GET`    | `/api/v1/solutions/{id}/pdf`   | Download as PDF              |
| `DELETE` | `/api/v1/solutions/{id}`       | Delete a solution            |
| `GET`    | `/api/v1/health`               | Health check                 |

### Example

```bash
curl -X POST http://localhost:8000/api/v1/solutions \
  -H "Content-Type: application/json" \
  -d '{"problem_statement":"Reduce food waste in college canteens","title":"SmartCanteen"}'
```

## 🗄️ Database Migrations

```bash
cd backend
alembic upgrade head            # apply
alembic revision --autogenerate -m "message"   # create new
```

## 🔐 Notes

- The Gemini API key is used **server-side only** — never exposed to the browser.
- The problem statement is treated strictly as data (prompt-injection guarded).
- Auth is intentionally omitted for this MVP (single demo user).

## 🧭 Roadmap (post-MVP)

- User authentication & per-user history
- Celery + Redis worker queue for generation
- Regenerate individual sections
- Shareable public links
- Vector search over past solutions

---

Built to win hackathons. ⚡
