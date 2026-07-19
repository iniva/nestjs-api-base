# Copilot Instructions

## Purpose

This is a production-ready **NestJS REST API base template** with JWT authentication, user management, PostgreSQL integration, and Docker support. It is intended to serve as a starting point for new APIs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS v11 (TypeScript v5) |
| Database | PostgreSQL 18 via TypeORM v0.3 |
| Authentication | Passport.js — local (email/password) + JWT bearer tokens |
| Password hashing | Node.js `crypto.pbkdf2Sync` (PBKDF2, 10 000 iterations) |
| Logging | Pino via `nestjs-pino` (structured JSON, auth header redacted) |
| Validation | `class-validator` + `class-transformer` |
| HTTP security | `helmet` |
| Containerisation | Docker multi-stage builds; Docker Compose for local dev & integration tests |
| Package manager | pnpm 11 (via Corepack; `packageManager` field pins the version) |
| Testing | Jest v29 + ts-jest; Faker.js + Axios for integration tests |

---

## Project Structure

```
src/
├── main.ts                        # Bootstrap: Pino logger, Helmet, global validation pipe
├── app.module.ts                  # Root module
├── app.controller.ts              # POST /auth/login (LocalAuthGuard)
├── app.service.ts                 # Minimal root service
├── hash.manager.ts                # PBKDF2 hash/compare utility (+ spec)
├── auth/                          # Auth module
│   ├── auth.module.ts
│   ├── auth.service.ts            # validateUser(), login() → { access_token }
│   ├── constants.ts               # JWT_SECRET, JWT_EXPIRATION (from env)
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── local-auth.guard.ts
│   └── strategies/
│       ├── local.strategy.ts      # Validates email + hashed password
│       └── jwt.strategy.ts        # Extracts JWT payload → { id, email }
├── users/
│   ├── user.entity.ts             # TypeORM entity (id UUID, email unique, password, firstName?, lastName?, active, createdAt, updatedAt?)
│   ├── user.type.ts               # User, AuthedUser TypeScript types
│   ├── user.providers.ts          # USER_REPOSITORY injection token
│   ├── users.module.ts
│   ├── users.service.ts           # findByEmail(), findById(), save()
│   ├── users.controller.ts        # POST /users, GET /users/profile, PUT /users
│   ├── users.controllers.spec.ts
│   └── dto/
│       ├── create-user.dto.ts     # email (valid email), password (min 8 chars)
│       └── update-user.dto.ts     # email?, firstName?, lastName?, password? (all optional)
├── database/
│   ├── database.module.ts         # Global module; provides DataSource
│   ├── database.providers.ts      # TypeORM DataSource factory (auto-runs migrations)
│   └── constants.ts               # DATA_SOURCE, USER_REPOSITORY tokens
├── config/
│   ├── app.config.ts              # APP_ENV, APP_PORT, APP_LOG_LEVEL, APP_HASH_SALT, APP_HASH_ITERATIONS
│   └── postgres.config.ts         # DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
│   └── bad-request.factory.ts     # Maps class-validator errors → structured 400 JSON
└── health/
    └── health.controller.ts       # GET /health

migrations/
└── 1721806991705-add_user_table.ts

test/
└── integration/
    ├── auth.spec.ts
    ├── users.spec.ts
    └── helpers/api.ts             # Axios client helpers
```

---

## API Endpoints

| Method | Path | Guard | Description |
|---|---|---|---|
| `POST` | `/auth/login` | `LocalAuthGuard` | Login → `{ access_token }` |
| `POST` | `/users` | None | Register user |
| `GET` | `/users/profile` | `JwtAuthGuard` | Get own profile (no password/active) |
| `PUT` | `/users` | `JwtAuthGuard` | Update own profile |
| `GET` | `/health` | None | Health check |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `APP_ENV` | `staging` | Environment name |
| `APP_PORT` | `3000` | HTTP port |
| `APP_LOG_LEVEL` | `log` | Pino log level |
| `APP_HASH_SALT` | — | **Required.** PBKDF2 salt |
| `APP_HASH_ITERATIONS` | `10000` | PBKDF2 iterations |
| `JWT_SECRET` | — | **Required.** JWT signing secret |
| `JWT_EXPIRATION` | — | JWT expiry (e.g. `1d`) |
| `DB_HOST` | `localhost` | Postgres host |
| `DB_PORT` | `5432` | Postgres port |
| `DB_USERNAME` | — | Postgres user |
| `DB_PASSWORD` | — | Postgres password |
| `DB_DATABASE` | — | Postgres database name |

---

## Code Conventions & Patterns

### Modules
- Each feature is a self-contained NestJS module (`auth`, `users`).
- `DatabaseModule` is global (`@Global()`) and exports `DATA_SOURCE`.
- Configs use `@nestjs/config` with `ConfigModule.forRoot()` loading `app.config.ts` and `postgres.config.ts`.

### Repository Pattern
- Repositories are injected via custom tokens (e.g. `USER_REPOSITORY`) defined in `database/constants.ts`.
- Do **not** use `TypeOrmModule.forFeature()` — use the provider factory pattern in `*.providers.ts` files.

### DTOs & Validation
- All request bodies use class-validator DTO classes.
- Global `ValidationPipe` with `whitelist: true` and `forbidUnknownValues: true` strips and rejects unknown properties.
- Validation errors are formatted via `BadRequestFactory` into a structured JSON response.

### Authentication
- Public routes require no guard.
- Login route uses `LocalAuthGuard` (Passport local strategy).
- Protected routes use `@UseGuards(JwtAuthGuard)`.
- The authenticated user is available as `req.user: AuthedUser` (`{ id, email }`).

### TypeORM Entities
- Entities live in `*.entity.ts` files and are auto-discovered by TypeORM.
- Schema changes are done through migrations (`NAME=<name> pnpm run migrate:create`).
- Migrations run automatically on startup (`migrationsRun: true`).

### Path Aliases
- `@/*` resolves to `src/`
- `@Test/*` resolves to `test/integration/`

### Naming
- Files: `kebab-case` (e.g. `create-user.dto.ts`)
- Classes: `PascalCase`
- Constants/injection tokens: `UPPER_SNAKE_CASE`

---

## Testing

### Unit Tests
```bash
pnpm run test:unit
pnpm run test:coverage
```
- Co-located with source files as `*.spec.ts`.
- Use Jest mocks for dependencies.

### Integration Tests
```bash
# Requires a running Postgres instance or Docker
pnpm run test:integration
bash docker/test-integration/run.sh
```
- Located in `test/integration/`.
- Use Faker.js to generate unique test data per run.
- Use Axios via `test/integration/helpers/api.ts` to call the live API.
- Run with `--runInBand` (sequential).

---

## Docker

| Target | Command | Description |
|---|---|---|
| Local dev | `bash docker/local/run.sh` | NestJS (debug/watch) + Postgres 15 |
| Integration tests | `bash docker/test-integration/run.sh` | API + Postgres + test runner |
| Production build | `docker/live/Dockerfile` | Multi-stage: builder → release (Alpine) |

---

## Common Commands

```bash
pnpm run start:debug          # Local dev with watch + debugger
pnpm run build                # Compile TypeScript → dist/
pnpm run test:unit            # Unit tests
pnpm run test:integration     # Integration tests
pnpm run test:coverage        # Coverage report
NAME=<migration_name> pnpm run migrate:create   # Scaffold a new TypeORM migration
pnpm run healthcheck          # curl GET /health
```

---

## Documentation Maintenance

**Every AI model working in this repository must keep documentation up-to-date** when making changes:

- **This file (`.github/copilot-instructions.md`):** Must reflect the current architecture, modules, endpoints, environment variables, conventions, and commands. Update any section that becomes stale after a change (e.g. new endpoint, new env var, new module, changed convention).

- **`README.md`:** Must remain accurate for human readers setting up and running the project. Update setup steps, environment variable descriptions, and usage examples whenever the relevant code changes.

Each file has a distinct audience and scope:
- `copilot-instructions.md` → AI context: precise technical details, conventions, patterns.
- `README.md` → Human developers: setup, usage, overview.

Do not let either file drift out of sync with the actual codebase.
