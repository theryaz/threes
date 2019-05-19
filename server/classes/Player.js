const uuid = require('uuid/v4');
const { getName } = require('../shared/util');
const Game = require('./Game');

class Player{
  constructor(socket){
    this.socket = socket;
    this.id = uuid();
    this.gameId = null;
    console.log(`Player connected (${this.id})`);
  }
  hostGame(){
    let game = new Game(this.id);
    console.log(`Player ${this.id} hosting game ${game.id}`);
    this.socket.send(JSON.stringify({
      channel: 'hostGame',
      payload: {
        gameId: game.id
      }
    }));
    return game;
  }
  joinGame(gameId){
    this.socket.send(JSON.stringify({
      channel: 'joinGame',
      payload: {
        gameId
      }
    }));
  }
}

module.exports = Player;
