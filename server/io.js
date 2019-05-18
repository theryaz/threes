const util = require('./shared/util.js');
const games = {};

module.exports = function(io){
  return function(socket){
    console.log("Got a connection!", socket);
    socket.on('host', () => {
      let gameId = util.generateId(6);
      console.log("Generated Game Id", gameId);
      games[gameId] = {};

    });
  };
};
