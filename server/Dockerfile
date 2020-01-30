FROM node:13.6.0-alpine

COPY dist /app
COPY node_modules /app/server/node_modules

WORKDIR /app

CMD node /app/server/src/app.js