const express = require('express');
const WebSocket = require('ws');
const logger = require('./shared/winston');

const version = require('./package.json').version;
const PORT = process.env.PORT || 8000;
const WS_PORT = process.env.PORT || 9090;
const { PlayerList, GameList } = require('./storage');
const routes = require('./routes');
const { errorHandler } = require('./errors');

const wss = new WebSocket.Server({ port: WS_PORT });
const app = express();
app.listen(PORT);
logger.info("HTTP Server Started on " + PORT);
app.use('/', routes);
app.use(errorHandler);

const socketHandler = require('./websockets.js');

wss.on('connection', socketHandler);
logger.info("WebSocket Server Started on " + WS_PORT);


// Broadcast Game List
// setInterval(() => {
//   let payload = JSON.stringify({
//     channel: 'gameListUpdate',
//     payload: GameList
//   });
//   logger.debug("Broadcast GameList", GameList);
//   wss.clients.forEach(function each(client) {
//     client.send(payload);
//   });
// }, 5000);
