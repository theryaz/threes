const util = require('./shared/util.js');
const games = {};

const { Player, Game, SocketRouter } = require('./classes');
const { PlayerList, GameList } = require('./storage');

module.exports = function(socket){
  console.log(`Got a connection! ${PlayerList.length + 1} Players Connected.`);

  let player = new Player(socket);
  PlayerList.push(player);

  const socketRouter = new SocketRouter({
    hostGame,
    joinGame
  });
  socket.on('message', (data) => socketRouter.handleMessage(this, data));
  socket.on('close', () => {
    let i = PlayerList.findIndex((x) => x.id === player.id);
    PlayerList.splice(i, 1);
    console.log(`Connection closed. ${PlayerList.length + 1} Players Connected.`);
  });


  function hostGame(){
    let game = player.hostGame();
    GameList.push(game);
  }
  function joinGame({id}){
    console.log("Joing Game", id);
    let game = GameList.find(x => x.id == id);
    if(game){
      player.joinGame(game);
    }else{
      console.log("Game Not Found", GameList);
    }
  }

};
