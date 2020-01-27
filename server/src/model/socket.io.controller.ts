import { createLogger, sleep } from '../shared';
const logger = createLogger("socket.io.controller.ts");
import { CONFIG } from '../model/constants';

import * as GameMutationTypes from '../../../client-ts/src/store/game/game.types';
import * as MultiplayerMutationTypes from '../../../client-ts/src/store/multiplayer/multiplayer.types';
import { ICell } from '../../../client-ts/src/model/views';
import { IPlayerInfo, ICoords, IGameGridState, IGameMove, IGameState } from '../../../client-ts/src/model/interfaces';
import { Player } from './classes/Player';
import { Game } from './classes/Game';

function getRandom(min: number, max: number){
  return Math.floor(Math.random() * max) + min;
}

export const connectedPlayers: {[id: string]: Player} = {};
export const gameList: Game[] = [];

export class SocketIOController{
	
	private connectedClients: number = 0;
	private connectedPlayers: {[id: string]: Player} = connectedPlayers;
	private gameList: Game[] = gameList;

	constructor(public io: SocketIO.Server){
		this.setupCleanupDeadConnections();
		// this.startDebugLogInterval();
	}
	private addClient(socket: SocketIO.Socket){
		this.connectedPlayers[socket.client.id] = new Player(socket);
		this.connectedClients++;
		this.io.emit(MultiplayerMutationTypes.ADD_USER, this.connectedPlayers[socket.client.id]);
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
	private startDebugLogInterval(){
		logger.debug("startDebugLogInterval");
		const logSocketState = () => {
			console.log(`Server has ${this.connectedClients} connections`);
			console.log(Object.keys(this.connectedPlayers).map(key => 
				`${this.connectedPlayers[key].Username} IsReady: ${this.connectedPlayers[key].IsReady}`
			).join('\n'));
		};
		logSocketState();
		setInterval(logSocketState, 8000);
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
		});
	}
	// public async testJoinPlayer(socket: SocketIO.Socket){
	// 	logger.info("testJoinPlayer");
	// 	await sleep(5);
	// 	logger.info("testJoinPlayer: " + GameMutationTypes.SET_REMOTE_PLAYER_INFO);
	// 	socket.emit(GameMutationTypes.SET_REMOTE_PLAYER_INFO, <IPlayerInfo>{
	// 		username: "The Server",
	// 		avatarIcon: "fa-robot",
	// 		color: "blue",
	// 	});
	// }

};