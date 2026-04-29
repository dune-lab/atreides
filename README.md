# atreides

User identity service. Manages user creation, email confirmation, and credential validation.

Named after House Atreides from Dune — the noble house that holds the truth.

## Stack

- Node.js 24 + TypeScript
- Fastify (via `@enxoval/http`)
- PostgreSQL + TypeORM (via `@enxoval/db`)
- Kafka (via `@enxoval/messaging`)
- JWT auth middleware (via `@enxoval/auth`)

## How to Run

```bash
cp .env.example .env
npm install
npm run migration:run
npm run dev
```

Or with Docker (from `platform/`):

```bash
docker-compose up atreides
```

Default port: **3002**

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Health check |
| `GET` | `/docs` | — | API reference |
| `POST` | `/users` | — | Create a new user |
| `POST` | `/users/confirm-email` | — | Confirm user email |
| `POST` | `/users/authenticate` | — | Validate credentials (used by janus) |
| `GET` | `/users/:id` | Bearer JWT | Get user by ID |

## Examples

### POST /users

```bash
curl -X POST http://localhost:3002/users \
  -H 'Content-Type: application/json' \
  -d '{ "name": "Paul Atreides", "email": "paul@arrakis.dune", "password": "spice123", "role": "student" }'
```

### POST /users/confirm-email

```bash
curl -X POST http://localhost:3002/users/confirm-email \
  -H 'Content-Type: application/json' \
  -d '{ "id": "uuid-here" }'
```

### GET /users/:id

```bash
curl http://localhost:3002/users/uuid-here \
  -H 'Authorization: Bearer <token>'
```

## Events Published

| Topic | Trigger | Payload |
|-------|---------|---------|
| `userCreated` | `POST /users` | `{ userId, email, role }` |
| `mailConfirmed` | `POST /users/confirm-email` | `{ userId, email }` |

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
| `JWT_SECRET` | Secret used to validate incoming tokens |

## Scripts

```bash
npm run dev                # dev server with hot reload
npm run build              # compile TypeScript
npm test                   # run all tests
npm run lint               # check formatting and lint
npm run migration:run      # apply migrations
npm run migration:revert   # revert last migration
```
