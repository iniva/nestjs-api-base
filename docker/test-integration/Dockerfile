FROM node:20 as builder

ENV HOME /app
WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm i

CMD [ "npm", "run", "test:integration" ]
