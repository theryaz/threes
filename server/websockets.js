const util = require('./shared/util.js');
const games = {};

const { Player, Game } = require('./classes');

const PlayerList = [];
const GameList = [];

module.exports = function(socket){
  console.log("Got a connection!");

  let player = new Player(socket);
  PlayerList.push(player);

  socket.on('message', (data) => {
    let message = JSON.parse(data);
    switch (message.channel) {
      case 'hostGame':
          hostGame(message.payload);
        break;
      default:
        console.log(`Got message for channel with no handler: ${message.channel}`);
    }
    // player.joinGame();
  });

  function hostGame(){
    let game = player.hostGame();
    GameList.push(game);
  }
};
