import store from '../store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import apiService from '../../services/api.service';
import { ICell } from '../../model/views';
import { IPlayerInfo, IGameState, IGameMove, IGameGridState, ICellValue } from '../../model/interfaces';
import Game from '../../components/Game/Game.vue';

import * as GameMutationTypes from './game.types';

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
		autoStart: true,
		paused: false,
		gameOver: false,
		score: 0,
		keyboardEnabled: true,
		isRemote: false,
		nextNumber: 1,
		history: [],
		initialGridState: this.randomGridState(3),
	};

	localGameState: IGameState = {
		autoStart: true,
		paused: true,
		gameOver: false,
		score: 0,
		keyboardEnabled: true,
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
		autoStart: true,
		paused: true,
		gameOver: false,
		score: 0,
		keyboardEnabled: false,
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
		},
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
	@Action({ commit: GameMutationTypes.REMOTE_GAME_OVER }) onRemoteGameOver(score: number){
		return score;
	}
	@Mutation [GameMutationTypes.REMOTE_GAME_OVER](){
		this.remoteGameState.gameOver = true;
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
	@Action({ commit: GameMutationTypes.GAME_OVER }) onGameOver(score: number){
		apiService.socket.emit('onLocalGameOver');
		return score;
	}
	@Mutation [GameMutationTypes.GAME_OVER](score: number){
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
	@Action({ commit: GameMutationTypes.SINGLE_GAME_OVER }) onSingleGameOver(score: number){
		return score;
	}
	@Mutation [GameMutationTypes.SINGLE_GAME_OVER](score: number){
		this.singleGameState.gameOver = true;
		this.singleGameState.score = score;
	}
	@Action({ commit: GameMutationTypes.SINGLE_GAME_PAUSE }) onSingleGamePause(){ }
	@Mutation [GameMutationTypes.SINGLE_GAME_PAUSE](){
		this.remoteGameState.paused = true;	
	}

}