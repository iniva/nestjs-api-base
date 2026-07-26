FROM node:24 AS tester

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV HOME /app
ENV HUSKY 0
WORKDIR /app

COPY ./package.json /app/package.json
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml

RUN pnpm install --frozen-lockfile --ignore-scripts

CMD [ "pnpm", "run", "test:integration" ]
