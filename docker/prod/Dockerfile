# Builder stage
FROM node:14 as builder

ENV HOME /app
WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install --frozen-lockfile

COPY ./tsconfig.json /app/tsconfig.json
COPY ./tsconfig.build.json /app/tsconfig.build.json
COPY ./src /app/src

RUN yarn build
RUN rm -rf ./node_modules && \
  yarn install --production

# Release stage
FROM node:14-alpine
ENV NODE_ENV=production
ENV HOME /app
WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/tsconfig.json /app
COPY --from=builder /app/package.json /app
COPY --from=builder /app/node_modules /app/node_modules

CMD [ "yarn", "start:prod" ]
