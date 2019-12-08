import { createLogger, sleep } from '../shared';
const logger = createLogger("socket.io.controller.ts");
import { CONFIG } from '../model/constants';

import * as GameMutationTypes from '../../../client-ts/src/store/game/game.types';
import { ICell } from '../../../client-ts/src/model/views';
import { IPlayerInfo, ICoords, IGameGridState, IGameMove, IGameState } from '../../../client-ts/src/model/interfaces';
import { Player } from './classes/Player';
import { Game } from './classes/Game';

function getRandom(min: number, max: number){
  return Math.floor(Math.random() * max) + min;
}

export class SocketIOController{
	
	private connectedClients: number = 0;
	private connectedPlayers: {[id: string]: Player} = {};
	private gameList: Game[] = [];

	private autoPairInterval;

	constructor(private io: SocketIO.Server){
		this.setupCleanupDeadConnections();
		// this.startAutoPairPlayersInterval();
	}
	private addClient(socket: SocketIO.Socket){
		this.connectedPlayers[socket.client.id] = new Player(socket);
		this.connectedClients++;
		logger.debug(`${this.connectedClients} clients connected`);
	}
	private removeClient(socketId: string){
		delete this.connectedPlayers[socketId];
		this.connectedClients--;
		logger.debug(`${this.connectedClients} clients connected`);
	}
	private setupCleanupDeadConnections(){
		setInterval(() => {
				this.cleanupDeadConnections();
		}, CONFIG.SOCKETS.EXPIRY_INTERVAL);
	}
	private cleanupDeadConnections(){
		// logger.debug("Cleanup Dead connections...");
		for(let player of Object.values(this.connectedPlayers)){
			if(player.isDisconnected === true){
				logger.debug("Removed Dead connection: " + player.socketId);
				this.removeClient(player.socketId);
			}
		}
	}


  public initializeSocketIOHandlers(){
    logger.info("initializeSocketIOHandlers");
		this.io.on('connection', (socket) => {
			const clientLogger = createLogger(`Client ${socket.client.id}`);
			clientLogger.info("Connected");
			this.addClient(socket);
			socket.on('disconnect', () =>{
				clientLogger.info("Disconnected");
				this.removeClient(socket.client.id);
			});

			socket.on('jwt', () => {
				sleep(2);
				this.autoPairPlayers();
			});
			socket.on('SET_TEMP_USERNAME', () => {
				sleep(2);
				this.autoPairPlayers();
			});
		});
	}
	public async testJoinPlayer(socket: SocketIO.Socket){
		logger.info("testJoinPlayer");
		await sleep(5);
		logger.info("testJoinPlayer: " + GameMutationTypes.SET_REMOTE_PLAYER_INFO);
		socket.emit(GameMutationTypes.SET_REMOTE_PLAYER_INFO, <IPlayerInfo>{
			username: "The Server",
			avatarIcon: "fa-robot",
			color: "blue",
		});
	}

	startAutoPairPlayersInterval(){
		this.autoPairInterval = setInterval(() => {
			this.autoPairPlayers();
		}, 10 * 1000);
	}
	autoPairPlayersNow(){
		if(this.autoPairInterval) clearInterval(this.autoPairInterval);
		this.autoPairPlayers();
		this.startAutoPairPlayersInterval();
	}
	autoPairPlayers(){
		logger.debug(`Auto join players to games (${this.connectedClients} clients connected)`);
		if(this.connectedClients > 1){
			let pair: Player[] = [];
			for(let player of Object.values(this.connectedPlayers)){
				if(!player.Username){
					continue;
				}
				if(!player.isInGame) pair.push(player);
				if(pair.length == 2){
					this.gameList.push(new Game(this.io, pair));
				}
			}
		}
	}
};