const uuid = require('uuid/v4');
const { getName } = require('../shared/util');
const Game = require('./Game');
const { PlayerList, GameList } = require('../storage');

class Player{
  constructor(socket){
    this.socket = socket;
    this.id = uuid();
    this.gameId = null;
    logger.debug(`Player connected (${this.id})`);
  }
  hostGame(){
    let game = new Game(this.id);
    logger.debug(`Player ${this.id} hosting game ${game.id}`);
    this.socket.send(JSON.stringify({
      channel: 'hostGame',
      payload: {
        gameId: game.id
      }
    }));
    return game;
  }
  joinGame(game){
    let hostPlayer = PlayerList.find(x => x.id === game.hostId);
    hostPlayer.socket.send(JSON.stringify({
      channel: 'playerJoined',
      payload:{
        playerId: this.id
      }
    }));
    game.guestId = this.id;
    this.socket.send(JSON.stringify({
      channel: 'joinGame',
      payload: {
        gameId: game.id,
        remotePlayerId: game.hostId,
      }
    }));
  }
}

module.exports = Player;
