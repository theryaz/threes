import store from '../store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import apiService from '../../services/api.service';
import { ICell } from '../../model/views';
import { IPlayerInfo, IGameState, IGameMove, IGameGridState, IGameOverPayload, ICellValue } from '../../model/interfaces';
import Game from '../../components/Game/Game.vue';

import * as GameMutationTypes from './game.types';
import { PlayerStatus, GameStatus } from '@/model/enums';

const noUser: IPlayerInfo = {
	username: "Waiting for Player",
	avatarUrl: null,
	avatarIcon: "fa-user-clock",
	color: "primary",
};

@Module({
	namespaced: true,
	dynamic: true,
	name: 'gameStore',
	store: store
})
export default class GameModule extends VuexModule{

	getRandom(min: number, max: number){
    return Math.floor(Math.random() * max) + min;
  }
	private randomGridState(n: number = 3): IGameGridState{
		let cells: ICellValue[] = [];
		for(let i = 0; i < 3; i ++){
			cells.push({
				value: this.getRandom(1,3),
				r: this.getRandom(0,3),
				c: this.getRandom(0,3),
			});
		}
		return {
			nextNumber: this.getRandom(1,3),
			cells,
		}
	}

	isPaused: boolean = false;
	isSearching: boolean = false;
	isConnected: boolean = false;
	remotePlayer: IPlayerInfo = {
		username: noUser.username,
		avatarUrl: noUser.avatarUrl,
		avatarIcon: noUser.avatarIcon,
		color: noUser.color,
	};

	singleGameState: IGameState = {
		status: GameStatus.InProgress,
		autoStart: true,
		paused: false,
		gameOver: false,
		score: 0,
		keyboardEnabled: true,
		isOnline: false,
		isMultiplayer: false,
		isRemote: false,
		nextNumber: 1,
		history: [],
		initialGridState: this.randomGridState(3),
		// initialGridState: {
		// 	cells: [
		// 		{c:0,r:0,value:1},
		// 		{c:1,r:0,value:2},
		// 		{c:2,r:0,value:3},
		// 		{c:3,r:0,value:6},
		// 		{c:0,r:1,value:12},
		// 		{c:1,r:1,value:24},
		// 		{c:2,r:1,value:48},
		// 		{c:3,r:1,value:96},
		// 		{c:0,r:2,value:192},
		// 		{c:1,r:2,value:384},
		// 		{c:2,r:2,value:768},
		// 		{c:3,r:2,value:1536},
		// 		{c:0,r:3,value:3072},
		// 		{c:1,r:3,value:6144},
		// 		{c:2,r:3,value:12288},
		// 		{c:3,r:3,value:24576},
		// 	],
		// 	nextNumber: 1,
		// }
	};

	multiplayerGameStatus: PlayerStatus = PlayerStatus.InLobby;
	hostGameLoading: boolean = false;
	hostGameError: string | null = null;
	gameShortId: string | null = null;
	
	joinGameLoading: boolean = false;
	joinGameError: string | null = null;

	// Online Multiplayer States
	localGameState: IGameState = {
		status: GameStatus.WaitingToStart,
		autoStart: false,
		paused: true,
		gameOver: false,
		score: 0,
		keyboardEnabled: true,
		isOnline: true,
		isMultiplayer: true,
		isRemote: false,
		nextNumber: 1,
		history: [],
		initialGridState:{
			cells: [
				{c:1,r:1,value:1},
				{c:2,r:2,value:2},
				{c:3,r:3,value:3},
			],
			nextNumber: 1,
		}
	};

	remoteGameState: IGameState = {
		status: GameStatus.WaitingToStart,
		autoStart: true,
		paused: true,
		gameOver: false,
		score: 0,
		keyboardEnabled: false,
		isOnline: true,
		isMultiplayer: true,
		isRemote: true,
		nextNumber: 1,
		history: [],
		initialGridState: {
			cells: [
				{c:1,r:1,value:1},
				{c:2,r:2,value:2},
				{c:3,r:3,value:3},
			],
			nextNumber: 1,
		}
	};

	// Local Multiplayer States.
	leftGameState: IGameState = {
		status: GameStatus.InProgress,
		autoStart: true,
		paused: true,
		gameOver: false,
		score: 0,
		keyboardEnabled: true,
		isOnline: false,
		isMultiplayer: true,
		isRemote: false,
		nextNumber: 1,
		history: [],
		initialGridState:{
			cells: [
				{c:1,r:1,value:1},
				{c:2,r:2,value:2},
				{c:3,r:3,value:3},
			],
			nextNumber: 1,
		}
	};
	rightGameState: IGameState = {
		status: GameStatus.InProgress,
		autoStart: true,
		paused: true,
		gameOver: false,
		score: 0,
		keyboardEnabled: true,
		isOnline: false,
		isMultiplayer: true,
		isRemote: false,
		nextNumber: 1,
		history: [],
		initialGridState:{
			cells: [
				{c:1,r:1,value:1},
				{c:2,r:2,value:2},
				{c:3,r:3,value:3},
			],
			nextNumber: 1,
		}
	};


	@Action({}) async hostGame(){
		this.context.commit(GameMutationTypes.HOST_GAME);
		try{
			const response = await apiService.post('/v1/game/create', {});
			this.context.commit(GameMutationTypes.HOST_GAME_SUCCESS, {
				gameShortId: response.body.gameShortId,
			}); 
		}catch(e){
			this.context.commit(GameMutationTypes.HOST_GAME_FAILURE);
		}
	}
	@Mutation [GameMutationTypes.HOST_GAME](){
    this.hostGameLoading = true;
    this.hostGameError = null;
	}
	@Mutation [GameMutationTypes.HOST_GAME_SUCCESS]({ gameShortId }: { gameShortId: string }){ // TODO
		this.hostGameLoading = false;
		this.gameShortId = gameShortId;
		this.multiplayerGameStatus = PlayerStatus.HostedGame;
		this.localGameState.status = GameStatus.WaitingToStart;
		this.localGameState.initialGridState = {
			cells: [],
			nextNumber: 1,
		};
		this.remoteGameState.status = GameStatus.WaitingToStart;
		this.remoteGameState.initialGridState = {
			cells: [],
			nextNumber: 1,
		};
	}
	@Mutation [GameMutationTypes.HOST_GAME_FAILURE](errorMessage: string){
		this.hostGameLoading = false;
		this.hostGameError = errorMessage;
	}

	@Action({rawError: true}) async joinGame(gameShortId: string){
		this.context.commit(GameMutationTypes.JOIN_GAME);
		try{
			await apiService.post(`/v1/game/join/${gameShortId}`, {});
			this.context.commit(GameMutationTypes.JOIN_GAME_SUCCESS); 
			return true;
		}catch(e){
			console.error("Failed to Join Game", e);
			this.context.commit(GameMutationTypes.JOIN_GAME_FAILURE, e.body.result.message);
			return false;
		}
	}
	@Mutation [GameMutationTypes.JOIN_GAME](){
    this.joinGameLoading = true;
    this.joinGameError = null;
	}
	@Mutation [GameMutationTypes.JOIN_GAME_SUCCESS](){
		this.joinGameLoading = false;
		this.multiplayerGameStatus = PlayerStatus.JoinedGame;
		this.localGameState.initialGridState = {
			cells: [],
			nextNumber: 1,
		};
		this.remoteGameState.initialGridState = {
			cells: [],
			nextNumber: 1,
		};
	}
	@Mutation [GameMutationTypes.JOIN_GAME_FAILURE](errorMessage: string){
		this.joinGameLoading = false;
		this.joinGameError = errorMessage;
	}

	@Action({commit: GameMutationTypes.SET_REMOTE_PLAYER_INFO}) onSetRemotePlayerInfo(playerInfo: IPlayerInfo){ return playerInfo; }
	@Mutation [GameMutationTypes.SET_REMOTE_PLAYER_INFO](playerInfo: IPlayerInfo){
		this.remotePlayer.username = playerInfo.username;
		this.remotePlayer.avatarUrl = playerInfo.avatarUrl;
		this.remotePlayer.avatarIcon = playerInfo.avatarIcon;
		this.remotePlayer.color = playerInfo.color;
	}
	@Mutation [GameMutationTypes.CLEAR_REMOTE_PLAYER_INFO](playerInfo: IPlayerInfo){
		this.remotePlayer.username = noUser.username;
		this.remotePlayer.avatarUrl = noUser.avatarUrl;
		this.remotePlayer.avatarIcon = noUser.avatarIcon;
		this.remotePlayer.color = noUser.color;
	}

	@Action({ commit: GameMutationTypes.REMOTE_GAME_START }) onRemoteGameStart(initialGridState: IGameGridState){
		return initialGridState;
	}
	@Mutation [GameMutationTypes.REMOTE_GAME_START](initialGridState: IGameGridState){
		this.remoteGameState.paused = false;
		this.localGameState.gameOver = false;
		this.localGameState.status = GameStatus.InProgress;
		this.remoteGameState.status = GameStatus.InProgress;
		this.remoteGameState.initialGridState = initialGridState;
		this.localGameState.history = [];
	}
	@Action({ commit: GameMutationTypes.REMOTE_MOVE }) onRemoteMove(move: IGameMove){
		return move;
	}
	@Mutation [GameMutationTypes.REMOTE_MOVE](move: IGameMove){
		this.remoteGameState.nextNumber = move.nextNumber;
		this.remoteGameState.history.push(move);
	}
	@Action({ commit: GameMutationTypes.REMOTE_GAME_OVER }) onRemoteGameOver({ score }: IGameOverPayload){
		return { score };
	}
	@Mutation [GameMutationTypes.REMOTE_GAME_OVER](){
		this.remoteGameState.gameOver = true;
		this.remoteGameState.status = GameStatus.GameOver;
	}
	@Action({ commit: GameMutationTypes.REMOTE_GAME_PAUSE }) onRemoteGamePause(){ }
	@Mutation [GameMutationTypes.REMOTE_GAME_PAUSE](){
		this.remoteGameState.paused = true;	
	}
	

	@Action({commit: GameMutationTypes.GAME_START}) onGameStart(initialGridState: IGameGridState){
		apiService.socket.emit('onGameStart', initialGridState);
		return initialGridState;
	}
	@Mutation [GameMutationTypes.GAME_START](initialGridState: IGameGridState){
		this.localGameState.paused = false;
		this.localGameState.keyboardEnabled = true;
		this.localGameState.gameOver = false;
		this.localGameState.initialGridState = initialGridState;
		this.localGameState.history = [];
	}
	@Action({ commit: GameMutationTypes.MOVE }) onMove(move: IGameMove){
		apiService.socket.emit('onMove', move);
		return move;
	}
	@Mutation [GameMutationTypes.MOVE](move: IGameMove){
		this.localGameState.nextNumber = move.nextNumber;
		this.localGameState.history.push(move);
	}
	@Action({ commit: GameMutationTypes.GAME_OVER }) onGameOver({ score }: IGameOverPayload){
		apiService.socket.emit('onGameOver');
		return { score };
	}
	@Mutation [GameMutationTypes.GAME_OVER]({ score }: IGameOverPayload){
		this.localGameState.gameOver = true;
		this.localGameState.score = score;
	}
	@Action({ commit: GameMutationTypes.GAME_PAUSE }) onGamePause(){ }
	@Mutation [GameMutationTypes.GAME_PAUSE](){
		this.remoteGameState.paused = true;
	}

	@Action({commit: GameMutationTypes.SINGLE_GAME_START}) onSingleGameStart(initialGridState: IGameGridState){
		return initialGridState;
	}
	@Mutation [GameMutationTypes.SINGLE_GAME_START](initialGridState: IGameGridState){
		this.singleGameState.paused = false;
		this.singleGameState.keyboardEnabled = true;
		this.singleGameState.gameOver = false;
		this.singleGameState.initialGridState = initialGridState;
		this.singleGameState.history = [];
	}
	@Action({ commit: GameMutationTypes.SINGLE_MOVE }) onSingleMove(move: IGameMove){
		return move;
	}
	@Mutation [GameMutationTypes.SINGLE_MOVE](move: IGameMove){
		this.singleGameState.nextNumber = move.nextNumber;
		this.singleGameState.history.push(move);
	}
	@Action({ commit: GameMutationTypes.SINGLE_GAME_OVER }) onSingleGameOver({ score }: IGameOverPayload){
		return { score };
	}
	@Mutation [GameMutationTypes.SINGLE_GAME_OVER]({ score }: IGameOverPayload){
		this.singleGameState.gameOver = true;
		this.singleGameState.score = score;
	}
	@Action({ commit: GameMutationTypes.SINGLE_GAME_PAUSE }) onSingleGamePause(){ }
	@Mutation [GameMutationTypes.SINGLE_GAME_PAUSE](){
		this.singleGameState.paused = true;	
	}


	@Action({commit: GameMutationTypes.LEFT_GAME_START}) onLeftGameStart(initialGridState: IGameGridState){
		return initialGridState;
	}
	@Mutation [GameMutationTypes.LEFT_GAME_START](initialGridState: IGameGridState){
		this.leftGameState.paused = false;
		this.leftGameState.keyboardEnabled = true;
		this.leftGameState.gameOver = false;
		this.leftGameState.initialGridState = initialGridState;
		this.leftGameState.history = [];
	}
	@Action({ commit: GameMutationTypes.LEFT_MOVE }) onLeftMove(move: IGameMove){
		return move;
	}
	@Mutation [GameMutationTypes.LEFT_MOVE](move: IGameMove){
		this.leftGameState.nextNumber = move.nextNumber;
		this.leftGameState.history.push(move);
	}
	@Action({ commit: GameMutationTypes.LEFT_GAME_OVER }) onLeftGameOver({ score }: IGameOverPayload){
		return { score };
	}
	@Mutation [GameMutationTypes.LEFT_GAME_OVER]({ score }: IGameOverPayload){
		this.leftGameState.gameOver = true;
		this.leftGameState.score = score;
	}
	@Action({ commit: GameMutationTypes.LEFT_GAME_PAUSE }) onLeftGamePause(){ }
	@Mutation [GameMutationTypes.LEFT_GAME_PAUSE](){
		this.leftGameState.paused = true;	
	}

	@Action({commit: GameMutationTypes.RIGHT_GAME_START}) onRightGameStart(initialGridState: IGameGridState){
		return initialGridState;
	}
	@Mutation [GameMutationTypes.RIGHT_GAME_START](initialGridState: IGameGridState){
		this.rightGameState.paused = false;
		this.rightGameState.keyboardEnabled = true;
		this.rightGameState.gameOver = false;
		this.rightGameState.initialGridState = initialGridState;
		this.rightGameState.history = [];
	}
	@Action({ commit: GameMutationTypes.RIGHT_MOVE }) onRightMove(move: IGameMove){
		return move;
	}
	@Mutation [GameMutationTypes.RIGHT_MOVE](move: IGameMove){
		this.rightGameState.nextNumber = move.nextNumber;
		this.rightGameState.history.push(move);
	}
	@Action({ commit: GameMutationTypes.RIGHT_GAME_OVER }) onRightGameOver({ score }: IGameOverPayload){
		return { score };
	}
	@Mutation [GameMutationTypes.RIGHT_GAME_OVER]({ score }: IGameOverPayload){
		this.rightGameState.gameOver = true;
		this.rightGameState.score = score;
	}
	@Action({ commit: GameMutationTypes.RIGHT_GAME_PAUSE }) onRightGamePause(){ }
	@Mutation [GameMutationTypes.RIGHT_GAME_PAUSE](){
		this.rightGameState.paused = true;	
	}

	@Action({ commit: GameMutationTypes.ON_EXIT_MULTIPLAYER }) onExitMultiplayer(){ }
	@Mutation [GameMutationTypes.ON_EXIT_MULTIPLAYER](){
		apiService.socket.emit(GameMutationTypes.ON_EXIT_MULTIPLAYER);

		this.isSearching = false;
		this.isConnected = false;
		this.remotePlayer = {
			username: noUser.username,
			avatarUrl: noUser.avatarUrl,
			avatarIcon: noUser.avatarIcon,
			color: noUser.color,
		};

		this.localGameState = {
			status: GameStatus.WaitingToStart,
			autoStart: false,
			paused: true,
			gameOver: false,
			score: 0,
			keyboardEnabled: true,
			isOnline: true,
			isMultiplayer: true,
			isRemote: false,
			nextNumber: 1,
			history: [],
			initialGridState:{
				cells: [
					{c:1,r:1,value:1},
					{c:2,r:2,value:2},
					{c:3,r:3,value:3},
				],
				nextNumber: 1,
			}
		};
	
		this.remoteGameState = {
			status: GameStatus.WaitingToStart,
			autoStart: true,
			paused: true,
			gameOver: false,
			score: 0,
			keyboardEnabled: false,
			isOnline: true,
			isMultiplayer: true,
			isRemote: true,
			nextNumber: 1,
			history: [],
			initialGridState: {
				cells: [
					{c:1,r:1,value:1},
					{c:2,r:2,value:2},
					{c:3,r:3,value:3},
				],
				nextNumber: 1,
			}
		};
	}

	@Action({ commit: GameMutationTypes.REMOTE_PLAYER_EXIT }) onRemotePlayerExit(){
		console.log("REMOTE_PLAYER_EXIT");
	}
	@Mutation [GameMutationTypes.REMOTE_PLAYER_EXIT](){}

}