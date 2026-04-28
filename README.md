# atreides

User identity service. Manages user creation and email confirmation.

## Stack

- Node.js 24 + TypeScript
- Fastify (via `@enxoval/http`)
- PostgreSQL + TypeORM (via `@enxoval/db`)
- Kafka (via `@enxoval/messaging`)

## How to Run

```bash
cp .env.example .env
npm install
npm run migration:run
npm run dev
```

Or with Docker:

```bash
docker-compose up
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/docs` | API reference |
| `POST` | `/users` | Create a new user |
| `POST` | `/users/confirm-email` | Confirm user email |
| `GET` | `/users` | List all users |

## POST /users

```bash
curl -X POST http://localhost:3002/users \
  -H 'Content-Type: application/json' \
  -d '{ "name": "Paul Atreides", "email": "paul@arrakis.dune", "password": "spice123", "role": "student" }'
```

## POST /users/confirm-email

```bash
curl -X POST http://localhost:3002/users/confirm-email \
  -H 'Content-Type: application/json' \
  -d '{ "id": "uuid-here" }'
```

## Events

| Topic | Trigger | Payload |
|-------|---------|---------|
| `userCreated` | `POST /users` | `{ userId, email, role }` |
| `mailConfirmed` | `POST /users/confirm-email` | `{ userId, email }` |

## Scripts

```bash
npm run dev          # dev server with hot reload
npm run build        # compile TypeScript
npm test             # run all tests
npm run lint         # check formatting and lint
npm run migration:run      # apply migrations
npm run migration:revert   # revert last migration
```
