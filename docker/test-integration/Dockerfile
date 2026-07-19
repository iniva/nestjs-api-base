FROM node:24 AS builder

RUN corepack enable

ENV HOME /app
WORKDIR /app

COPY ./package.json /app/package.json
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

CMD [ "pnpm", "run", "test:integration" ]
