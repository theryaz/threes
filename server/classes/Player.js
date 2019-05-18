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
    return game;
  }
}

module.exports = Player;
