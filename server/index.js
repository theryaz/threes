const http = require('http');
const version = require('./package.json').version;

const app = http.createServer((req, res) => {
  res.json({result: {
    message: "Threes With Friends API",
    version: version
  }});
}).listen(process.env.PORT || 9090);

const io = require('socket.io')(app);
const socketHandler = require('./io.js');

io.on('connection', socketHandler(io));
