# atreides

User identity service. Manages user creation, email confirmation, and credential validation.

Named after House Atreides from Dune — the noble house that holds the truth.

## Stack

- Node.js 22 + TypeScript
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
npm run build              # compile TypeScript + generate contracts.json
npm test                   # run all tests
npm run unit               # unit tests only
npm run integration        # integration tests only
npm run lint               # check formatting and lint
npm run lint-fix           # auto-fix formatting
npm run migration:run      # apply pending migrations
npm run migration:revert   # revert last migration
```

## CI Pipeline

Every PR runs 5 checks in sequence:

```
Build
├── Unit Tests
├── Integration Tests
└── Publish Contracts
        └── Contract Validation
```

| Check | Description |
|-------|-------------|
| **Build** | Compiles TypeScript, generates `contracts.json` |
| **Unit Tests** | Fast tests, no external dependencies |
| **Integration Tests** | Tests with DB and Kafka |
| **Publish Contracts** | Publishes `contracts.json` to [dune-lab/contracts](https://github.com/dune-lab/contracts) |
| **Contract Validation** | Runs kanly — validates wire compatibility with all HTTP partners |

## Contract Validation

Wire types live in `src/wire/`. After every build, `contracts.json` is generated automatically via the `postbuild` script and published to the contract registry.

To add metadata to a wire type for richer kanly logs:

```ts
static describe() {
  return {
    _meta: { method: 'POST', path: '/users' },
    id: { type: 'uuid' },
    name: { type: 'string' },
  };
}
```
