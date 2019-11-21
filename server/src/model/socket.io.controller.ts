import { createLogger, sleep } from '../shared';
const logger = createLogger("socket.io.controller.ts");
import { CONFIG } from '../model/constants';

import * as GameMutationTypes from '../../../client-ts/src/store/game/game.types';
import { ICell } from '../../../client-ts/src/model/views';
import { IPlayerInfo, ICoords } from '../../../client-ts/src/model/interfaces';

function getRandom(min: number, max: number){
  return Math.floor(Math.random() * max) + min;
}

export class SocketIOController{
	
	private connectedClients: number = 0;
	private clientSockets: {[id: string]: SocketIO.Socket} = {};

	constructor(private io: SocketIO.Server){
		this.setupCleanupDeadConnections();
	}
	private addClient(socket: SocketIO.Socket){
		this.clientSockets[socket.client.id] = socket;
		this.connectedClients++;
		logger.debug(`${this.connectedClients} clients connected`);
	}
	private removeClient(socket: SocketIO.Socket){
		delete this.clientSockets[socket.client.id];
		this.connectedClients--;
		logger.debug(`${this.connectedClients} clients connected`);
	}
	private setupCleanupDeadConnections(){
		setInterval(() => {
				this.cleanupDeadConnections();
		}, CONFIG.SOCKETS.EXPIRY_INTERVAL);
	}
	private cleanupDeadConnections(){
		logger.debug("Cleanup Dead connections...");
		for(let socket of Object.values(this.clientSockets)){
			if(socket.disconnected === true){
				logger.debug("Removed Dead connection: " + socket.client.id);
				this.removeClient(socket);
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
				this.removeClient(socket);
			});
			socket.on('onMoveUp', () => {
				clientLogger.silly("onMoveUp");
				// socket.emit(GameMutationTypes.REMOTE_MOVE_UP);
			});
			socket.on('onMoveDown', () => {
				clientLogger.silly("onMoveDown");
				// socket.emit(GameMutationTypes.REMOTE_MOVE_DOWN);
			});
			socket.on('onMoveLeft', () => {
				clientLogger.silly("onMoveLeft");
				// socket.emit(GameMutationTypes.REMOTE_MOVE_LEFT);
			});
			socket.on('onMoveRight', () => {
				clientLogger.silly("onMoveRight");
				// socket.emit(GameMutationTypes.REMOTE_MOVE_RIGHT);
			});
			// this.testGameInit(socket);
		});
	}
	public async testGameInit(socket: SocketIO.Socket){
		logger.info("testGameInit");
		await sleep(5);
		logger.info("testGameInit: " + GameMutationTypes.SET_REMOTE_PLAYER_INFO);
		socket.emit(GameMutationTypes.SET_REMOTE_PLAYER_INFO, <IPlayerInfo>{
			username: "The Server",
			avatarIcon: "fa-robot",
			color: "blue",
		});

		await sleep(1);
		logger.info("testGameInit: " + GameMutationTypes.START_GAME);
		socket.emit(GameMutationTypes.START_GAME);
	}

	// Temp Cell Functions
	createRandomCell(){
    return this.createCell({
      r: getRandom(0,3),
      c: getRandom(0,3),
    }, getRandom(1,3));
  }
  createCell(coords: ICoords, value: number): Partial<ICell>{
		return {
			row: coords.r,
			col: coords.c,
			value: value,
		};
  }
};