FROM node:14 as builder

ENV HOME /app
WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install

CMD ["yarn", "test:integration"]
