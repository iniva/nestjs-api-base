# Builder stage
FROM node:18 as builder

ENV HOME /app
ENV HUSKY 0
WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm ci

COPY ./tsconfig.json /app/tsconfig.json
COPY ./tsconfig.build.json /app/tsconfig.build.json
COPY ./src /app/src
# uncomment when using migrations
# COPY ./migrations /app/migrations

RUN npm run build
# -------
# Below commands are commented because they cause an issue with
# a dependency that requires node-gyp
# -------
# RUN rm -rf ./node_modules && \
#   npm i --omit=dev --ignore-scripts
# -------

# Release stage
FROM node:18-alpine
ENV NODE_ENV=production
ENV HOME /app
WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/tsconfig.json /app
COPY --from=builder /app/package.json /app
COPY --from=builder /app/node_modules /app/node_modules

CMD [ "npm", "run", "start:prod" ]
