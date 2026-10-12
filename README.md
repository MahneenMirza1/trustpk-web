# TrustPK

AI-Powered Citizen Digital Assistant for Government Awareness, Education, and Cybersecurity.

## Project Overview

TrustPK is a unified web platform for Pakistani citizens. It will bring together trusted information and assistance across:

- Government schemes and programs
- Government jobs and opportunities
- International and national scholarships
- University admissions and accreditation
- Phishing / fake website detection
- Fake news verification
- AI chatbot assistance
- Smart notifications
- User authentication and profiles
- Admin management

Day 1 establishes the full-stack foundation only. Business modules will be added incrementally.

## Technology Stack

| Layer | Stack |
| --- | --- |
| Frontend | Next.js + TypeScript + Tailwind CSS |
| Backend | FastAPI + Python |
| Database | PostgreSQL + pgvector |
| Infrastructure | Docker + Docker Compose |
| API testing | Postman (recommended) |

## Project Structure

```text
trust_pk_3/
├── frontend/          # Next.js App Router application
├── backend/           # FastAPI application
├── database/init/     # PostgreSQL init scripts (pgvector)
├── docs/              # Architecture documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## Running the Project

1. Copy environment template and adjust values if needed:

```bash
cp .env.example .env
```

2. Start all services:

```bash
docker compose up --build
```

3. Open the apps:

| Service | URL |
| --- | --- |
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API docs (Swagger) | http://localhost:8000/docs |
| Database | localhost:25432 |

> Note: Host PostgreSQL port defaults to **25432** so it does not conflict with local PostgreSQL on `5432` or an existing TrustPK Postgres container on `15432`. Inside Docker, services still connect to `db:5432`.

Stop services (keeps the database volume):

```bash
docker compose down
```

Do **not** use `docker compose down -v` unless you intentionally want to delete database data.

## Environment Variables

See `.env.example` for the full list. Important variables:

- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`
- `DATABASE_URL` (backend → PostgreSQL; use host `db` inside Compose)
- `BACKEND_PORT`, `FRONTEND_PORT`, `FRONTEND_URL`
- `NEXT_PUBLIC_API_URL` (browser → backend)
- `ENVIRONMENT`

Never commit `.env` or real secrets.

## Health Endpoints

- `GET /` → `{ "message": "TrustPK API is running" }`
- `GET /api/health` → `{ "status": "healthy", "service": "TrustPK API" }`
- `GET /api/health/db` → `{ "status": "healthy", "database": "connected" }`

## API Documentation

FastAPI interactive docs are available at:

http://localhost:8000/docs

## Architecture

See [docs/architecture.md](docs/architecture.md) for the Day 1 architecture and planned future integrations.
