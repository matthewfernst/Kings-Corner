FROM node:14

EXPOSE 8000

WORKDIR /app

RUN mkdir dist
COPY dist ./dist

COPY package.json .
COPY schema.graphql .

ENV NODE_ENV production

RUN npm install
ENTRYPOINT node ./dist/server.js
