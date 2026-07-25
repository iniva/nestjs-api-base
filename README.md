[![CI](https://github.com/iniva/nestjs-api-base/actions/workflows/ci.yml/badge.svg)](https://github.com/iniva/nestjs-api-base/actions/workflows/ci.yml)

# NestJS API Base
API based on [NestJS](https://nestjs.com) <img src="https://docs.nestjs.com/assets/logo-small-gradient.svg" width="80" alt="Nest Logo" />

## Included
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
pnpm run test:unit -- file.manager
```

### Integration tests
> You need to have a valid `.env` file in the root of the project. The integration test suite uses this to mimic the behaviour it has during the CI runs
```sh
bash docker/test-integration/run.sh
```

## Other Commands
### Creating migrations
> Migrations are SQL files generated from schema changes. Run after modifying `src/database/schema.ts`
```sh
pnpm run migrate:generate
```
