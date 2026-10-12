# TrustPK Architecture

## Day 1 Runtime Architecture

```text
User (Browser)
      ↓
Next.js Frontend  (http://localhost:3000)
      ↓
FastAPI Backend   (http://localhost:8000)
      ↓
PostgreSQL + pgvector  (host port 25432 → container 5432)
```

### Layer responsibilities

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Frontend | Next.js + TypeScript + Tailwind | Citizen-facing UI, routing, client API calls |
| Backend | FastAPI + Pydantic + SQLAlchemy | Business APIs, validation, database access |
| Database | PostgreSQL 15 + pgvector | Persistent relational data and vector search readiness |

## Design principles

- Modular folders so feature modules can be added without restructuring.
- Secrets and connection strings come only from environment variables.
- Frontend never connects directly to PostgreSQL.
- CORS is restricted to configured frontend origins.
- Database schema for business modules is introduced module-by-module (not on Day 1).

## Planned frontend routes (not implemented on Day 1)

- `/universities`
- `/jobs`
- `/scholarships`
- `/schemes`
- `/verify`
- `/news`
- `/chat`
- `/dashboard`
- `/profile`
- `/admin`

## Planned backend modules (not implemented on Day 1)

- Universities, admissions, and accreditation
- Government jobs and opportunities
- International scholarships
- Government schemes and programs
- Fake website / phishing detection
- Fake news verification
- AI chatbot assistant
- Smart notifications
- Authentication and user profiles
- Admin panel

## Future integrations (not implemented on Day 1)

These services may be added later and are intentionally out of scope for Day 1:

- **AI/ML services** — model inference for verification, ranking, and chat
- **Redis** — caching, rate limiting, and background job queues
- **Firebase** — authentication and optional realtime features
- **External APIs** — government and scholarship data providers
- **WhatsApp API** — citizen messaging channel
- **Notification service** — email/push/SMS delivery

## Data flow (Day 1 verified path)

1. Browser loads the Next.js homepage.
2. Homepage calls `GET /api/health` via `NEXT_PUBLIC_API_URL`.
3. FastAPI responds with service health.
4. `GET /api/health/db` verifies SQLAlchemy connectivity to PostgreSQL.
5. PostgreSQL runs with the `vector` extension enabled for later embeddings work.

## Docker services

| Service | Container | Purpose |
| --- | --- | --- |
| `frontend` | `trustpk3-frontend` | Next.js app |
| `backend` | `trustpk3-backend` | FastAPI app |
| `db` | `trustpk3-postgres` | PostgreSQL + pgvector |

Named volume `trustpk_pgdata` persists database data across container restarts.
