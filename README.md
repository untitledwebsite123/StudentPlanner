# StudentPlanner

A full-stack planner for students to manage assignments, exams, labs, habits, and personal tasks with actionable insights. Built with React + TypeScript on the front-end and Express + Prisma on the back-end.

## Features
- Capture rich task metadata (course, type, estimated hours, due date, recurrence, notes, priority).
- Smart views for Today, Upcoming (next 7 days), and Habits with streak tracking.
- Calendar strip summarizing workload per day.
- Analytics sidebar aggregating total/pending hours, completions this week, and course distribution.
- REST API powered by Express, Prisma, and SQLite (swap for Postgres/MySQL for production).
- Vitest-powered unit tests for workload computations.

## Project Structure
```
Projects/StudentPlanner
├── server/            # Express API + Prisma ORM
└── (frontend files)   # Vite React client
```

## Getting Started
### 1. Backend API
```bash
cd server
cp .env.example .env   # update if needed
npm install
npm run prisma:migrate
npm run dev            # starts http://localhost:4000
```

### 2. Frontend
```bash
npm install
npm run dev            # starts Vite dev server
```
Ensure `VITE_API_URL` in `.env` points to the API origin (defaults to `http://localhost:4000`).

### Production Build
```bash
# Build API
cd server && npm run build

# Build client
cd .. && npm run build
```

## Testing
```bash
npm run test
```
Runs Vitest unit tests (currently covering workload stats). Extend with component/integration tests as the app grows.

## Deployment Notes
- Swap Prisma's SQLite datasource for Postgres/MySQL for horizontal scalability.
- Containerize the API + frontend (`Dockerfile`s) and deploy behind a reverse proxy.
- Configure CI (GitHub Actions) to lint, test, and build on each PR.
- Use a managed DB (e.g., Supabase, Neon) and secrets manager for environment variables.

## API Endpoints
- `GET /api/tasks` – list tasks
- `POST /api/tasks` – create task
- `PUT /api/tasks/:id` – update task
- `DELETE /api/tasks/:id` – delete task

All payloads are validated with Zod to keep the contract strict.
