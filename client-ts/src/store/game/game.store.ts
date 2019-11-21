import store from '../store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { ICell } from '../../model/views';
import { IPlayerInfo } from '../../model/interfaces';

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

	isPaused: boolean = false;
	isSearching: boolean = false;
	remotePlayer: IPlayerInfo = {
		username: noUser.username,
		avatarUrl: noUser.avatarUrl,
		avatarIcon: noUser.avatarIcon,
		color: noUser.color,
	};
	remoteGame = {
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

	

	@Action({commit: GameMutationTypes.START_GAME}) onStartGame(){ return; }
	@Mutation [GameMutationTypes.START_GAME](){
		// Testing
		// this.remoteGame.grid.initializeGame(this.remoteGame.grid.ref, 9);
	}

	@Action({commit: GameMutationTypes.APPLY_REMOTE_STATE}) applyRemoteState(cellState: ICell[]){
		return cellState;
	}
	@Mutation [GameMutationTypes.APPLY_REMOTE_STATE](cellState: ICell[]){
		// this.remoteGame.grid.applyCellState(cellState);
	}
	
	@Action onRemoteGameEnd(payload){ return payload; }
	@Mutation [GameMutationTypes.REMOTE_GAME_END](){
		
	}
	
	@Action onRemoteGamePause(payload){ return payload; }
	@Mutation [GameMutationTypes.REMOTE_GAME_PAUSE](){
		
	}

	@Action({ commit: GameMutationTypes.REMOTE_MOVE_UP }) onRemoteMoveUp(){  }
	@Mutation [GameMutationTypes.REMOTE_MOVE_UP](){
		// this.remoteGame.grid.moveUp();
	}
	@Action({ commit: GameMutationTypes.REMOTE_MOVE_DOWN }) onRemoteMoveDown(){  }
	@Mutation [GameMutationTypes.REMOTE_MOVE_DOWN](){
		// this.remoteGame.grid.moveDown();
	}
	@Action({ commit: GameMutationTypes.REMOTE_MOVE_LEFT }) onRemoteMoveLeft(){  }
	@Mutation [GameMutationTypes.REMOTE_MOVE_LEFT](){
		// this.remoteGame.grid.moveLeft();
	}
	@Action({ commit: GameMutationTypes.REMOTE_MOVE_RIGHT }) onRemoteMoveRight(){  }
	@Mutation [GameMutationTypes.REMOTE_MOVE_RIGHT](){
		// this.remoteGame.grid.moveRight();
	}

}