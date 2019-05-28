const uuid = require('uuid/v4');

class Game{
  constructor(hostId){
    this.id = uuid();
    this.hostId = hostId;
    this.guestId = null;
  }
  joinGame(playerId){
    logger.debug(`Player ${playerId} joining game ${this.id}`);
  }
}

module.exports = Game;
