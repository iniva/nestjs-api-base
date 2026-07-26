# Changelog

All notable changes to this project will be documented in this file.
## [1.5.1] - 2026-07-26

### CI

- Improve dependabot flows (#292)

- Add missing permission and PAT to dependabot workflow (#296)


## [1.5.0] - 2026-07-26

### Features

- Replace TypeORM with Drizzle ORM and postgres.js driver (#288)


## [1.4.1] - 2026-07-25

### Build

- Several upgrades

- Upgrade all deps to their latest versions

- Udjust tsconfig for TS 6


### CI

- Bump actions. Use .nvmrc as node version tracker

- Support generating CHANGELOG and bumping package version (#276)

- Fix tag command (#278)

- Prevent Husky hooks from being triggered (#280)

- Use PAT token (#282)

- Add missing message to tag. Add logs (#285)


### Documentation

- Add copilot-instructions


### Miscellaneous

- Remove pnpm worskapce


### Refactor

- Make relevant changes to adjust to TS 6


## [1.4.0] - 2025-01-25

### Build

- *(deps-dev)* Bump axios from 1.7.3 to 1.7.4 (#217)

- Update deps

- Fix Dcokerfile lint issues


### CI

- Update actions in dependatbot workflow


### Documentation

- Update README.md


### Miscellaneous

- Update deps (#214)

- Update deps

- Move to eslint 9

- Re-create package-lock.json

- Update nest-related deps


### Refactor

- Prefer native uuid generation. Remove uuid dep


## [1.3.0] - 2024-07-24

### Bug Fixes

- Fix ci issue - bcrypt@5.1.1 was the guilty party


### Build

- Move to NodeJS 20. Improve Dockerfiles & docker-compose

- Update deps. Remove unnecessary deps

- Update tsconfigs

- Update package.json


### CI

- Update action versions


### Documentation

- Update README :memo:


### Features

- Enhance error mapping in bad-request factory

- Add dedicated configs. Add Migrations. Update user

- Re-implement hash manager to use crypto

- New database approach. Adapt code


### Miscellaneous

- Update minor and patch deps

- Remove unnecessary volume mapping in tester

- Update pre-commit script

- Remove static assets for client

- Update deps

- Update .* files:

- Remove unnecessary files

- Update .env files. Update README

- Clean-up


### Refactor

- Switch to npm


### Styling

- Fix lint


### Testing

- Use debug version of test:integration

- Update jest config for integration tests

- Update api helper port

- Update user controller unit


## [1.2.0] - 2023-06-17

### Build

- Update local postgres health check

- Update @nestjs/* and some other packages to their latest versions


### CI

- Remove merge strategy

- Switch dependabot updates to monthly

- Use author name/email for git push

- Set git pull strategy

- Configure concurrency

- Refactor dependabot-workflow

- Add missing GH_TOKEN


### Features

- Add api docs


### Miscellaneous

- Update minor a patch deps (#117)

- Update deps and dev deps

- Update deps

- Use nodejs v18 (#133)


### Testing

- Update tests


## [1.1.0] - 2023-02-18

### Build

- Update patch and minor version deps

- Update major versions for husky and faker. Adapt tests

- Update minor devDeps and deps

- Update major dep class-validator

- Update major devDeps axios and @types/uuid

- Update major dep @nestjs/jwt


### CI

- Add ci github workflow

- Remove unit test

- Add missing quote in matrix

- Fix postgres healthcheck command

- Use docker compose instead of docker-compose

- Rename docker/prod to docker/live

- Add dependabot config file

- Add ci to handle dependabot updates

- Remove deprecated set-output

- Set merge strategy when updating dependabot-updates branch


### Documentation

- Update README :docs:


### Features

- Add users controller

- Work on database and login integration

- Finish auth flows. Add integration tests

- Support password hashing


### Miscellaneous

- Working on new approach

- Update deps

- Add dedicated fix lint script

- Add JWT env variables

- Update major deps

- Update minor deps

- Update major deps @nestjs/typeorm and typeorm. Bump output to ES2020. Adapt code


### Testing

- Add users controller unit test



