const http = require('http');
const version = require('./package.json').version;

// const app = http.createServer((req, res) => {
//   res.json({result: {
//     message: "Threes With Friends API",
//     version: version
//   }});
// }).listen(process.env.PORT || 9090);

// const io = require('socket.io')(app);
const socketHandler = require('./websockets.js');
//
// io.on('connection', socketHandler(io));

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 9090 });

console.log("Starting WebSocket Server");
wss.on('connection', socketHandler);
