# Lead Tracker — Backend

**Live API:**  https://lead-tracker-ctvb.onrender.com

REST API for a lead generation tracker — create, list, search, and update the status of leads.

## Architecture

- **Runtime:** Node.js + Express
- **Database:** PostgreSQL (hosted on Neon)
- **Data model:** one `leads` table — `id` (UUID), `name`, `email` (unique), `phone`,
  `status` (enum), `created_at`
- **Request flow:** route → controller → `pool.query()` with parameterized SQL. No ORM —
  raw SQL was a deliberate choice (see Trade-offs).

### Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/leads` | Create a lead |
| `GET` | `/api/leads` | List/search leads. Query params: `limit`, `offset`, `search`, `status` |
| `PATCH` | `/api/leads/:id/status` | Update a lead's status |
| `GET` | `/health` | Health check, no DB dependency |

## Setup Instructions (local)

```bash
git clone https://github.com/monishak23/lead_tracker
cd lead_tracker
npm install
cp .env.example .env   # fill in DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
```

Apply the schema to a local (or remote) Postgres database:
```bash
psql -U postgres -d leadsdb -f db/schema.sql
```

Run it:
```bash
npm run dev  
```

### Environment variables

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (Render sets this automatically in production) |
| `CLIENT_ORIGIN` | Deployed frontend URL, for CORS |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Postgres connection details |
| `DB_SSL` | Set to `true` for hosted Postgres providers (Neon, etc.) that require SSL. Left unset/`false` locally. |

## Deployment Steps

1. **Database (Neon):** created a project on neon.tech, applied `db/schema.sql` via
   Neon's SQL editor, copied host/user/password/database into Render's env vars.
2. **API (Render):** New → Web Service → connected this GitHub repo → Build Command
   `npm install` → Start Command `npm start` → set all env vars above, including
   `DB_SSL=true` (required — Neon rejects unencrypted connections).
3. **CORS:** `CLIENT_ORIGIN` set to the deployed Vercel frontend URL so browser requests
   from production aren't blocked.
4. Verified via `curl https://lead-tracker-ctvb.onrender.com/health` and
   `curl https://lead-tracker-ctvb.onrender.com/api/leads`.

## Future Improvements

- Authentication/authorization (the API currently has no auth at all)
- Automated tests (unit tests for controllers, integration tests against a test DB)
- Structured logging
