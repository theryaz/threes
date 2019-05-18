const util = require('./shared/util.js');
const games = {};

const { Player, Game } = require('./classes');

const PlayerList = [];
const GameList = [];

module.exports = function(io){
  return function(socket){
    console.log("Got a connection!");

    let player = new Player(socket);
    PlayerList.push(player);

    socket.on('hostGame', () => {
      let game = player.hostGame();
      GameList.push(game);
    });

    socket.on('joinGame', (gameId) => {
      console.log(`Player Joining Game ${gameId}`);
      // player.joinGame();
    });
  };
};
