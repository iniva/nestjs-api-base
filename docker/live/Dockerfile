# Builder stage
FROM node:20 AS builder

ENV HOME /app
ENV HUSKY 0

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY ./src ./src
COPY ./tsconfig*.json ./

RUN npm run build
RUN rm -rf ./node_modules && \
  npm i --omit=dev --ignore-scripts

# Release stage
FROM node:20-alpine

ENV NODE_ENV=production
ENV HOME /app

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN npm run prisma:generate-client

CMD [ "npm", "run", "start:prod" ]
