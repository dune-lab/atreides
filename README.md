# atreides

User identity service. Manages user creation, email confirmation, and credential validation for the entire dune-lab platform.

Named after House Atreides from Dune — the noble house that holds the truth.

---

## Responsibilities

- Create and store user accounts
- Validate credentials for the auth service (janus)
- Confirm email addresses
- Publish domain events when users are created or verified
- Expose user data to other services

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 24 + TypeScript |
| HTTP | Fastify (`@enxoval/http`) |
| Database | PostgreSQL 16 + TypeORM (`@enxoval/db`) |
| Messaging | Kafka 3.7 (`@enxoval/messaging`) |
| Auth | JWT Bearer (`@enxoval/auth`) |
| Logging | Pino structured JSON (`@enxoval/observability`) |
| Validation | `createSchema` + `asyncFn` (`@enxoval/types`) |

---

## HTTP API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Health check |
| `GET` | `/docs` | — | API reference |
| `POST` | `/users` | — | Create a new user |
| `POST` | `/users/confirm-email` | — | Confirm user email address |
| `POST` | `/users/authenticate` | — | Validate credentials — used internally by janus |
| `GET` | `/users` | Bearer JWT | List all users |
| `GET` | `/users/:id` | Bearer JWT | Get user by ID |

### POST /users

```bash
curl -X POST http://localhost:3002/users \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Paul Atreides",
    "email": "paul@arrakis.dune",
    "password": "spice123",
    "role": "student"
  }'
```

### POST /users/authenticate

Called by janus during login. Validates `email + password` and returns user identity.

```bash
curl -X POST http://localhost:3002/users/authenticate \
  -H 'Content-Type: application/json' \
  -d '{ "email": "paul@arrakis.dune", "password": "spice123" }'
```

Returns `{ id, email, role }` on success, `401` on invalid credentials.

---

## Event-Driven

Atreides publishes domain events to Kafka when state changes occur:

| Event (topic) | Trigger | Payload |
|---------------|---------|---------|
| `userCreated` | `POST /users` succeeds | `{ userId, email, role }` |
| `mailConfirmed` | `POST /users/confirm-email` succeeds | `{ userId, email }` |

These events are available for any future consumer in the platform.

---

## Database Schema

| Table | Description |
|-------|-------------|
| `users` | User accounts (id, name, email, password_hash, role, emailVerified, createdAt) |

Migrations are located in `src/db/migrations/` and run automatically on startup.

---

## Observability

Every request emits structured JSON logs:

```json
{ "level": "info", "service": "atreides", "cid": "abc:0", "method": "POST", "url": "/users", "msg": "http-server: request received" }
{ "level": "info", "service": "atreides", "cid": "abc:0", "status": 201, "durationMs": 14, "msg": "http-server: response sent" }
```

Logs are available in Grafana via `{service="atreides"}`.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default: `3002`) |
| `HOST` | Bind address (default: `0.0.0.0`) |
| `DB_HOST` | Postgres host |
| `DB_PORT` | Postgres port |
| `DB_USER` | Postgres user |
| `DB_PASSWORD` | Postgres password |
| `DB_NAME` | Postgres database name |
| `KAFKA_BROKER` | Kafka broker address |
| `JWT_SECRET` | Secret shared across all services |

---

## Running Locally

```bash
cp .env.example .env
npm install
npm run migration:run
npm run dev
```

Default port: **3002**

---

## Scripts

```bash
npm run dev              # start with hot reload
npm run build            # compile TypeScript
npm test                 # run all tests (Vitest)
npm run lint             # check formatting + lint
npm run lint-fix         # auto-fix
npm run migration:run    # apply pending migrations
npm run migration:revert # revert last migration
```

---

## Dependency Updates

`@enxoval/*` dependencies are bumped automatically. When a new version is published from [dune-lab/enxoval](https://github.com/dune-lab/enxoval), a GitHub Actions workflow opens a PR in this repo updating `package.json` and `package-lock.json`. No manual version bumping required.
