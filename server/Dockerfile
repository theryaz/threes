FROM node:16.13.1-alpine

COPY dist /app
COPY node_modules /app/server/node_modules
COPY package.json /app/server/package.json

WORKDIR /app

CMD node /app/server/src/server.js