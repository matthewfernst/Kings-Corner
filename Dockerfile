FROM node:17

EXPOSE 8000

WORKDIR /app

RUN mkdir dist

COPY package.json schema.graphql .env* ./
COPY dist ./dist

ENV NODE_ENV production

RUN npm install --legacy-peer-deps
ENTRYPOINT node ./dist/server.js
