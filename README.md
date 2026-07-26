[![CI](https://github.com/iniva/nestjs-api-base/actions/workflows/ci.yml/badge.svg)](https://github.com/iniva/nestjs-api-base/actions/workflows/ci.yml)

# NestJS API Base
API based on [NestJS](https://nestjs.com) <img src="https://docs.nestjs.com/assets/logo-small-gradient.svg" width="80" alt="Nest Logo" />

## Included
- [x] **Architecture**: Hexagonal Architecture (Ports & Adapters) + Vertical Slices, with `eslint-plugin-boundaries` enforcing the dependency rule in CI.
- [x] **Authentication**: Local and JWT strategies.
- [x] **Database**: Postgres (using Drizzle ORM)
- Endpoints:
  - [x] Healthcheck
  - [x] Users
- Utilities:
  - [x] Hash Manager: used for password hashing (with `node:crypto`)
  - [x] Bad Request Factory: Maps ValidatorError(s) and transforms the final response payload.
- Docker:
  - [x] **local**: for development
  - [x] **test-integration**: for integration tests
  - [x] **live**: for deployment (dev, staging, prod, etc.)
- [x] **CI**: GitHub workflow with running tests (lint, coverage, integration).

## Architecture Overview

The project uses **Hexagonal Architecture** organised as **Vertical Slices**. Each feature is a self-contained folder under `src/features/` with four layers:

```
src/features/{feature}/
├── domain/            # Pure TypeScript classes — no framework or ORM dependencies
├── application/       # Use cases (service) + outbound port contracts (abstract classes)
│   └── ports/
├── infrastructure/    # Drizzle schema, repository adapters, mappers
│   └── persistence/
└── presenter/http/    # REST controllers and DTOs
```

Shared cross-cutting utilities (guards, `HashManager`, `BadRequestFactory`, `DatabaseModule`) live in `src/shared/`. Configs live in `src/configs/`.

The dependency rule (domain ← application ← infrastructure, presenter → application) is enforced automatically by `eslint-plugin-boundaries` on every pull request.

## Pre-requisites
- Duplicate the `.env.example` file, rename it to `.env` and update the corresponding variables with valid values

## Running the service locally
```sh
bash docker/local/run.sh
```

## Testing Locally
### Unit tests
```sh
# Run all unit tests
pnpm run test:unit

# Run specific unit test(s)
pnpm run test:unit -- <pattern>

# e.g.:
pnpm run test:unit -- hash.manager
```

### Integration tests
> You need to have a valid `.env` file in the root of the project. The integration test suite uses this to mimic the behaviour it has during the CI runs
```sh
bash docker/test-integration/run.sh
```

Integration test specs live in `test/integration/features/`, mirroring the `src/features/` structure. Add a new `{feature}.spec.ts` there when adding a new feature.

## Other Commands
### Lint (includes architectural boundary checks)
```sh
pnpm run test:lint
```

### Creating migrations
> Migrations are SQL files generated from schema changes. After modifying any feature schema file under `src/features/*/infrastructure/persistence/schema/`, run:
```sh
pnpm run migrate:generate
```
