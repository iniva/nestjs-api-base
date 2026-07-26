# Builder stage
FROM node:24 AS builder

RUN corepack enable

ENV HOME /app
ENV HUSKY 0
WORKDIR /app

COPY ./package.json /app/package.json
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY ./drizzle /app/drizzle
COPY ./src /app/src
COPY ./tsconfig.json /app/tsconfig.json
COPY ./tsconfig.build.json /app/tsconfig.build.json

RUN pnpm run prebuild
RUN pnpm run build
RUN pnpm install --prod --ignore-scripts

# Release stage
FROM node:24-alpine
ENV NODE_ENV=production
ENV HOME /app
WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/drizzle /app/drizzle
COPY --from=builder /app/tsconfig.json /app
COPY --from=builder /app/package.json /app
COPY --from=builder /app/node_modules /app/node_modules

CMD [ "node", "dist/src/main" ]
