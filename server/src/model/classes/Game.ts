import winston from 'winston';
import uuid from 'uuid/v4';
import { Socket } from 'socket.io';

import { Document } from 'mongoose';
import { User, UserModel } from '../db';
import { verifyJwt, createLogger, sleep, randomString } from '../../shared';

import { Player } from './Player';

import { socketIOController } from '../../app';

import * as UserMutationTypes from '../../../../client-ts/src/store/user/user.types';
import * as GameMutationTypes from '../../../../client-ts/src/store/game/game.types';
import * as MultiplayerMutationTypes from '../../../../client-ts/src/store/multiplayer/multiplayer.types';
import { IPlayerInfo, ICoords, IGameGridState, IGameMove, IGameState } from '../../../../client-ts/src/model/interfaces';

const GAME_OVER_COUNTDOWN_SECONDS = 30;
const START_CHECK_INTERVAL = 1 * 1000;
export class Game{
  
  get RoomId(){
    return `Game/${this.uuid}`;
  }
  
  get ShortId(){
    return this.shortId;
  }

  get GameOver(){
    return this.gameOver;
  }
  
  private gameOverCountdown: number = GAME_OVER_COUNTDOWN_SECONDS;
  private shortId: string;
  private logger: winston.Logger;
  private uuid: string;
  
  private readyCheckInterval;

  private gameOver = false;

  private players: Player[] = [];

  constructor(private io: SocketIO.Server, initialPlayers: Player[]){
    this.shortId = randomString(6).toUpperCase();
    this.uuid = uuid();
    this.logger = createLogger(`Game.ts ${this.uuid}`);
    this.logger.debug("Game Created");
    initialPlayers.forEach((player: Player) => {
      this.addPlayer(player);
    });
  }
  get AllPlayersReady(){
    return this.players.reduce((isReady,b) => isReady && b.IsReady, true);
  }

  get Players(){
    return this.players;
  }
  hasPlayer(player: Player){
    return this.players.find(p => p.socketId === player.socketId);
  }
  
  addPlayer(player: Player){
    player.isInGame = true;
    this.players.push(player);
    this.logger.debug(`${player.Username} joined`);
    if(this.players.length === 2){
      this.startGame();
    }
  }
  removePlayer(player: Player){
    player.isInGame = false;
    this.players.splice(this.players.findIndex(p => p.socketId === player.socketId),1);
    if(this.players.length === 0){
      this.logger.silly(`All players have left the game ${this.ShortId}`);
    }
  }

  async startGameInterval(){
    this.readyCheckInterval = setInterval(() => {
      this.startGame();
    }, START_CHECK_INTERVAL);
  }
  async clearGameInterval(){
    if(this.readyCheckInterval) clearInterval(this.readyCheckInterval);
  }
  async startGame(){
    if(this.players.length < 2){
      this.logger.silly(`Not enough players to start game: ${this.players.map(p => p.Username)}`);
    }
    if(this.AllPlayersReady){
      this.clearGameInterval();
      this.logger.info(`Starting Game! ${this.players.map(p => p.Username)}`);
      // this.addPlayersToGameRoom();
      this.sendPlayerInfo();
      this.emitStartGame();
      this.linkPlayerGames();
      this.listenForPlayerExit();
      this.listenForGameOver();
    }
  }
  private sendPlayerInfo(){
    console.log("sendPlayerInfo", this.players);
    this.players.forEach((player: Player, index: number) => {
      this.players.forEach((otherPlayer: Player, otherIndex: number) => {
        if(index === otherIndex) return;
        otherPlayer.socket.emit(GameMutationTypes.SET_REMOTE_PLAYER_INFO, player.PlayerInfo);
      });
    });
  }
  private emitStartGame(){
    this.players.forEach((player: Player) => {
      const initialGridState: IGameGridState = {
        cells: [
          {c:0,r:0,value:3},
          {c:1,r:0,value:3},
          {c:2,r:0,value:3},
          {c:3,r:0,value:3},
  
          {c:0,r:1,value:3},
          {c:1,r:1,value:3},
          {c:2,r:1,value:3},
          {c:3,r:1,value:3},
  
          {c:0,r:2,value:2},
          {c:1,r:2,value:2},
          {c:2,r:2,value:2},
          {c:3,r:2,value:2},
  
          {c:0,r:3,value:1},
          {c:1,r:3,value:1},
          {c:2,r:3,value:1},
          {c:3,r:3,value:1},
        ],
        nextNumber: 1
      }
      this.logger.silly("Emit GAME_START", this.players.map(p => p.PlayerInfo));
      player.socket.emit(GameMutationTypes.GAME_START, initialGridState);
    })
  }
  // TODO: This should use socket io namespaces or something instead of looping
  private linkPlayerGames(){
    this.players.forEach((player: Player, index: number) => {
      player.socket.on('onMove', (move: IGameMove) => {
        // this.logger.silly(`${player.Username}: ${move.direction}`);
        this.players.forEach((p, otherIndex: number) => {
          if(index === otherIndex) return;
          // this.logger.silly(`Emit Move to ${p.Username}`);
          p.socket.emit(GameMutationTypes.REMOTE_MOVE, move);
        });
      });
    });
  }
  private listenForPlayerExit(){
    this.players.forEach((player: Player) => {
      player.socket.on(GameMutationTypes.ON_EXIT_MULTIPLAYER, () => {
        this.logger.silly(`listenForPlayerExit: ${player.Username} exited`);
        this.players.filter(p => p.socketId !== player.socketId).forEach(p => p.socket.emit(GameMutationTypes.REMOTE_PLAYER_EXIT));
        this.removePlayer(player);
        this.gameOver = true;
        
        // TODO Don't push updates to the client like this
        socketIOController.io.emit(MultiplayerMutationTypes.GET_USERS);
      });
    });
  }
  private listenForGameOver(){
    this.players.forEach((player: Player) => {
      player.socket.on(GameMutationTypes.GAME_OVER, ({ score }) => {
        this.logger.silly(`listenForGameOver: ${player.Username} emitted game over`);
        this.players.filter(p => p.socketId !== player.socketId).forEach(p => p.socket.emit(GameMutationTypes.REMOTE_GAME_OVER, { score }));
        this.startGameOverCountDown();
      });
    });
  }
  async startGameOverCountDown(){
    if(this.gameOver === true){
      this.gameOverCountdown = 0;
      return;
    }
    this.gameOver = true;
    this.logger.silly('startGameOverCountDown');
    this.gameOverCountdown = GAME_OVER_COUNTDOWN_SECONDS;
    this.emitGameOverCountdown();
    while(this.gameOverCountdown > 0){
      await sleep(1000);
      this.gameOverCountdown--;
      this.logger.silly(`startGameOverCountDown ${this.gameOverCountdown}`);
      this.emitGameOverCountdown();
    }
    this.logger.silly(`startGameOverCountDown: Game Over!`);
  }
  emitGameOverCountdown(){
    this.players.forEach(p => p.socket.emit(GameMutationTypes.GAME_OVER_COUNTDOWN, this.gameOverCountdown));
  }
}