[![CI](https://github.com/iniva/nestjs-api-base/actions/workflows/ci.yml/badge.svg)](https://github.com/iniva/nestjs-api-base/actions/workflows/ci.yml)

# NestJS API Base
API based on [NestJS](https://nestjs.com) <img src="https://nestjs.com/img/logo_text.svg" width="80" alt="Nest Logo" />

## Included
- [x] **Authentication**: Local and JWT strategies.
- [x] **Database**: Postgres (using TypeORM)
- Endpoints:
  - [x] Healthcheck
  - [x] Users
- Utilities:
  - [x] Hash Manager: used for password hashing (with `bcrypt`)
  - [x] Bad Request Factory: Maps ValidatorError(s) and transforms the final response payload.
  - [ ] Tracker Middleware: (currently not used) Placeholder middleware
- Docker:
  - [x] **local**: for development
  - [x] **test-integration**: for integration tests
  - [x] **live**: for deployment (dev, staging, prod, etc.)
- [x] **CI**: GitHub workflow with running tests (lint, coverage, integration).

## Local Setup
- Clone this repo
- Duplicate `.env.example` and rename it to `.env`. Update variables as you need.
- Run the `run.sh` script from inside `docker/local` folder. This will build & start the API container (alongside with the database container)
  ```sh
  bash docker/local/run.sh
  ```
- By default, the API is listening on port `8091`. You can change this in the `.env` file.

# Running Tests
- **Unit**
  > run `yarn` or `yarn install` if you haven't already
  ```sh
  yarn test:unit
  ```
- **Integration**
  ```sh
  bash docker/test-integration/run.sh
  ```
