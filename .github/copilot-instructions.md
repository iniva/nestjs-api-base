# Copilot Instructions

## Purpose

This is a production-ready **NestJS REST API base template** with JWT authentication, user management, PostgreSQL integration, and Docker support. It is intended to serve as a starting point for new APIs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS v11 (TypeScript v5) |
| Database | PostgreSQL 18 via Drizzle ORM (`drizzle-orm` + `postgres` driver) |
| Authentication | Passport.js — local (email/password) + JWT bearer tokens |
| Password hashing | Node.js `crypto.pbkdf2Sync` (PBKDF2, 10 000 iterations) |
| Logging | Pino via `nestjs-pino` (structured JSON, auth header redacted) |
| Validation | `class-validator` + `class-transformer` |
| HTTP security | `helmet` |
| Containerisation | Docker multi-stage builds; Docker Compose for local dev & integration tests |
| Package manager | pnpm 11 (via Corepack; `packageManager` field pins the version) |
| Testing | Jest v29 + ts-jest; Faker.js + Axios for integration tests |

---

## Architecture

The project follows **Hexagonal Architecture (Ports & Adapters)** organised as **Vertical Slices**. Each feature owns all its layers in a single self-contained folder under `src/features/`.

### Dependency Rule

The rule is strict and enforced at lint time by `eslint-plugin-boundaries`:

| Zone | May import from |
|---|---|
| `domain` | nothing (zero external dependencies) |
| `application` | `domain`, `shared` |
| `infrastructure` | `domain`, `application`, `shared` |
| `presenter` | `application`, `shared` |
| feature `*.module.ts` | all layers (DI wiring only) |
| `shared` | `shared`, `configs` |

Violations are caught by `eslint-plugin-boundaries` on every pull request via CI.

### Port Injection Style

Repository ports and other outbound ports are defined as **abstract classes** (not interfaces). This allows NestJS to use them directly as DI tokens without requiring `@Inject()` decorators on constructor parameters.

```typescript
// Port definition
export abstract class UserRepositoryPort {
  abstract findOne(email: string): Promise<User | undefined>
}

// Module wiring — binds port to concrete adapter
{ provide: UserRepositoryPort, useClass: DrizzleUserRepository }

// Service injection — no @Inject() needed
constructor(private readonly repo: UserRepositoryPort) {}
```

---

## Project Structure

```
src/
├── main.ts                              # Bootstrap: Pino logger, Helmet, global validation pipe
├── app.module.ts                        # Root module — imports feature modules, config, logger
├── features/
│   ├── auth/
│   │   ├── application/
│   │   │   ├── ports/
│   │   │   │   └── auth.service.port.ts     # AuthServicePort (abstract class)
│   │   │   └── auth.service.ts              # validateUser(), login() → { access_token }
│   │   ├── infrastructure/
│   │   │   ├── jwt.strategy.ts              # Passport JWT strategy (infrastructure adapter)
│   │   │   └── local.strategy.ts            # Passport local strategy (infrastructure adapter)
│   │   ├── presenter/http/
│   │   │   └── auth.controller.ts           # POST /auth/login
│   │   ├── constants.ts                     # JWT_SECRET, JWT_EXPIRATION (from env)
│   │   └── auth.module.ts
│   └── users/
│       ├── domain/
│       │   ├── user.ts                      # Pure User class (no Drizzle types)
│       │   └── exceptions/
│       │       └── user-not-found.exception.ts
│       ├── application/
│       │   ├── ports/
│       │   │   └── user.repository.port.ts  # UserRepositoryPort (abstract class)
│       │   └── users.service.ts             # findOne(), findAll(), save()
│       ├── infrastructure/
│       │   └── persistence/
│       │       ├── schema/
│       │       │   └── user.schema.ts       # Drizzle pgTable definition + UserRow types
│       │       ├── repositories/
│       │       │   └── drizzle-user.repository.ts  # Implements UserRepositoryPort
│       │       └── mappers/
│       │           └── user.mapper.ts       # toDomain(row) / toRow(user)
│       ├── presenter/http/
│       │   ├── users.controller.ts          # POST /users, GET /users/profile, PUT /users
│       │   └── dto/
│       │       ├── create-user.dto.ts       # email (valid email), password (min 8 chars)
│       │       └── update-user.dto.ts       # email?, firstName?, lastName?, password? (all optional)
│       ├── users.controller.spec.ts
│       └── users.module.ts
├── shared/
│   ├── common/
│   │   ├── bad-request.factory.ts           # Maps class-validator errors → structured 400 JSON
│   │   ├── hash.manager.ts                  # PBKDF2 hash/compare utility (+ spec)
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts
│   │       └── local-auth.guard.ts
│   └── infrastructure/
│       └── persistence/
│           ├── constants.ts                 # DATA_SOURCE injection token
│           ├── database.module.ts           # Provides and exports DATA_SOURCE
│           ├── database.providers.ts        # postgres-js client + drizzle() factory; runs migrations on startup
│           └── schema.ts                    # Central schema barrel — re-exports all feature schemas
├── configs/
│   ├── app.config.ts                        # APP_ENV, APP_PORT, APP_LOG_LEVEL, APP_HASH_*, validation
│   └── postgres.config.ts                   # POSTGRES_HOST/PORT/USER/PASSWORD/DATABASE
└── health/
    └── health.controller.ts                 # GET /health

drizzle/
└── migrations/
    └── 0000_*.sql                           # SQL migrations generated by drizzle-kit

drizzle.config.ts                            # Points to src/features/**/schema/*.schema.ts glob
```

---

## API Endpoints

| Method | Path | Guard | Description |
|---|---|---|---|
| `POST` | `/auth/login` | `LocalAuthGuard` | Login → `{ access_token }` |
| `POST` | `/users` | None | Register user |
| `GET` | `/users/profile` | `JwtAuthGuard` | Get own profile (no password/active/id) |
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
| `JWT_EXPIRATION_TIME` | — | JWT expiry (e.g. `1d`) |
| `POSTGRES_HOST` | `postgres` | Postgres host |
| `POSTGRES_PORT` | `5432` | Postgres port |
| `POSTGRES_USER` | `dev` | Postgres user |
| `POSTGRES_PASSWORD` | `dev` | Postgres password |
| `POSTGRES_DATABASE` | `develop` | Postgres database name |

---

## Code Conventions & Patterns

### Adding a New Feature

Create a new folder under `src/features/{feature}/` with the following layers:

1. **`domain/`** — Pure TypeScript class. No framework decorators, no Drizzle types. Use `declare` for property declarations to satisfy `strictPropertyInitialization`.
2. **`application/ports/`** — Abstract class (not interface) defining the outbound contract.
3. **`application/{feature}.service.ts`** — Use cases as public methods. Depends only on ports and domain.
4. **`infrastructure/persistence/schema/{feature}.schema.ts`** — Drizzle `pgTable` definition. Export `{Feature}Row` and `New{Feature}Row` types.
5. **`infrastructure/persistence/mappers/{feature}.mapper.ts`** — `@Injectable()` class with `toDomain(row)` and `toRow(domain)` methods.
6. **`infrastructure/persistence/repositories/drizzle-{feature}.repository.ts`** — Implements the port. Injects `DATA_SOURCE`.
7. **`presenter/http/{feature}.controller.ts`** — REST controller. Depends on the application service only.
8. **`{feature}.module.ts`** — NestJS module that wires `{ provide: XxxRepositoryPort, useClass: DrizzleXxxRepository }`.
9. **`src/shared/infrastructure/persistence/schema.ts`** — Add `export * from '@/features/{feature}/infrastructure/persistence/schema/{feature}.schema'` so the Drizzle instance and drizzle-kit both see the new table.

### Domain Entity

```typescript
// features/{feature}/domain/{feature}.ts
export class MyFeature {
  declare id: string
  declare name: string
  // ... all fields with `declare` to satisfy strictPropertyInitialization
}
```

### Repository Port (abstract class)

```typescript
// features/{feature}/application/ports/{feature}.repository.port.ts
export abstract class MyFeatureRepositoryPort {
  abstract findById(id: string): Promise<MyFeature | undefined>
  abstract save(entity: MyFeature): Promise<void>
}
```

### Repository Adapter (Drizzle)

```typescript
// features/{feature}/infrastructure/persistence/repositories/drizzle-{feature}.repository.ts
@Injectable()
export class DrizzleMyFeatureRepository implements MyFeatureRepositoryPort {
  constructor(
    @Inject(DATA_SOURCE) private readonly db: PostgresJsDatabase<typeof schema>,
    private readonly mapper: MyFeatureMapper,
  ) {}
}
```

### NestJS Module Wiring

```typescript
@Module({
  imports: [DatabaseModule],
  providers: [
    MyFeatureService,
    MyFeatureMapper,
    { provide: MyFeatureRepositoryPort, useClass: DrizzleMyFeatureRepository },
  ],
  controllers: [MyFeatureController],
  exports: [MyFeatureService],
})
export class MyFeatureModule {}
```

### Schema & Migrations

- Each feature owns its Drizzle schema in `infrastructure/persistence/schema/{feature}.schema.ts`.
- `src/shared/infrastructure/persistence/schema.ts` is a barrel that re-exports all feature schemas. Add new exports here when adding features.
- `drizzle.config.ts` uses a glob (`src/features/**/infrastructure/persistence/schema/*.schema.ts`) so no config change is needed for new features.
- Migrations run automatically on startup via `migrate()` inside `database.providers.ts`.
- To generate a new migration after a schema change: `pnpm run migrate:generate`.

### DTOs & Validation

- All request bodies use `class-validator` DTO classes, placed in `presenter/http/dto/`.
- Global `ValidationPipe` with `whitelist: true` and `forbidUnknownValues: true` strips and rejects unknown properties.
- Validation errors are formatted via `BadRequestFactory` (`shared/common/bad-request.factory.ts`) into a structured JSON response.

### Authentication

- Public routes require no guard.
- Login route uses `LocalAuthGuard` (Passport local strategy).
- Protected routes use `@UseGuards(JwtAuthGuard)`.
- Guards live in `shared/common/guards/`.
- The authenticated user is available as `req.user: AuthedUser` (`{ id, email }`).

### HashManager

`shared/common/hash.manager.ts` is an `@Injectable()` service used for password hashing. Provide it explicitly in each module that needs it (`providers: [..., HashManager]`). It reads `app.hash.salt` and `app.hash.iterations` from `ConfigService`.

### Path Aliases

- `@/*` resolves to `src/`
- `@Test/*` resolves to `test/integration/`

### Naming Conventions

| Concern | Convention | Example |
|---|---|---|
| Files | `kebab-case` | `create-user.dto.ts` |
| Classes | `PascalCase` | `UsersService` |
| Constants / tokens | `UPPER_SNAKE_CASE` | `DATA_SOURCE` |
| Domain entity | `{feature}.ts` (no suffix) | `user.ts` |
| Drizzle schema | `{feature}.schema.ts` | `user.schema.ts` |
| Repository port | `{feature}.repository.port.ts` | `user.repository.port.ts` |
| Repository adapter | `drizzle-{feature}.repository.ts` | `drizzle-user.repository.ts` |
| Mapper | `{feature}.mapper.ts` | `user.mapper.ts` |

---

## Testing

### Unit Tests

```bash
pnpm run test:unit
pnpm run test:coverage
```

- Co-located with source files as `*.spec.ts`.
- Use Jest mocks for dependencies.
- Domain and application layers have zero infrastructure dependencies — no mocking of Drizzle required.

### Integration Tests

```bash
# Requires a running Postgres instance or Docker
pnpm run test:integration
bash docker/test-integration/run.sh
```

- Located in `test/integration/features/` — one spec file per feature, mirroring `src/features/`.
- Use Faker.js to generate unique test data per run.
- Use Axios via `test/integration/helpers/api.ts` (`@Test/helpers/api`) to call the live API.
- Run with `--runInBand` (sequential).
- When adding a new feature, add a matching `test/integration/features/{feature}.spec.ts`.

---

## Lint & Boundary Enforcement

```bash
pnpm run test:lint        # ESLint (includes boundary rules)
pnpm run test:lint:fix    # Auto-fix
pnpm run test:typecheck   # TypeScript type check (no emit)
```

`eslint-plugin-boundaries` enforces the hexagonal dependency rule. Any illegal cross-layer import (e.g. `presenter` importing from `infrastructure`) will fail linting. The `boundaries/dependencies` rule is configured in `eslint.config.mjs`.

---

## Docker

| Target | Command | Description |
|---|---|---|
| Local dev | `bash docker/local/run.sh` | NestJS (debug/watch) + Postgres |
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
pnpm run test:lint            # ESLint (boundary rules included)
pnpm run migrate:generate     # Generate a new Drizzle migration from schema changes
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
