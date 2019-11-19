// @ts-ignore
import { Http } from 'vue-resource';
import { getModule } from 'vuex-module-decorators';
import io from 'socket.io-client';
import { API_URL } from '../model/config';

import store from '../store/store';
import SocketModule from '../store/socket/socket.store';
import * as SocketMutationTypes from '../store/socket/socket.types';
const socketStore = getModule(SocketModule);

import GameModule from '../store/game/game.store';
import * as GameMutationTypes from '../store/game/game.types';
const gameStore = getModule(GameModule);

class ApiService{
	public socket: SocketIOClient.Socket = io.connect(API_URL);
	constructor(private baseUrl: string){
		console.log("ApiService Initialized baseUrl: ", this.baseUrl);
		this.setupSocketIO();
	}

	setupSocketIO(){
		this.socket.on(SocketMutationTypes.CONNECTED, socketStore.onConnected);
		this.socket.on(SocketMutationTypes.DISCONNECTED, socketStore.onDisconnected);
		this.socket.on(SocketMutationTypes.EVENT, socketStore.onEvent);
		
		this.socket.on(GameMutationTypes.SET_REMOTE_PLAYER_INFO, gameStore.onSetRemotePlayerInfo);
		this.socket.on(GameMutationTypes.START_GAME, gameStore.onStartGame);
		this.socket.on(GameMutationTypes.APPLY_REMOTE_STATE, gameStore.applyRemoteState);
		this.socket.on(GameMutationTypes.REMOTE_GAME_END, gameStore.onRemoteGameEnd);
		this.socket.on(GameMutationTypes.REMOTE_GAME_PAUSE, gameStore.onRemoteGamePause);

		this.socket.on(GameMutationTypes.REMOTE_MOVE_UP, gameStore.onRemoteMoveUp);
		this.socket.on(GameMutationTypes.REMOTE_MOVE_DOWN, gameStore.onRemoteMoveDown);
		this.socket.on(GameMutationTypes.REMOTE_MOVE_LEFT, gameStore.onRemoteMoveLeft);
		this.socket.on(GameMutationTypes.REMOTE_MOVE_RIGHT, gameStore.onRemoteMoveRight);
	}


	get(uri: string, headers={}){
		headers = {
			...headers,
			Authorization: this.getAuthHeader(),
		};
		return Http.get(`${this.baseUrl}${uri}`, { headers });
	}
	post(uri: string, payload: {[field:string]: any}, headers={}){
		headers = {
			...headers,
			Authorization: this.getAuthHeader(),
		};
		return Http.post(`${this.baseUrl}${uri}`, payload, { headers });
	}
	put(uri: string, payload: {[field:string]: any}, headers={}){
		headers = {
			...headers,
			Authorization: this.getAuthHeader(),
		};
		return Http.put(`${this.baseUrl}${uri}`, payload, { headers });
	}
	delete(uri: string, headers={}){
		headers = {
			...headers,
			Authorization: this.getAuthHeader(),
		};
		return Http.delete(`${this.baseUrl}${uri}`, { headers });
	}
	download(uri: string, headers={}, method='get'){
		headers = {
			...headers,
			Authorization: this.getAuthHeader(),
		};
		return Http[method](`${this.baseUrl}${uri}`, { headers, responseTye: 'arraybuffer' });
	}

	getAuthHeader(){
		// @ts-ignore
		if(store.state.userStore.jwt !== null){
			// @ts-ignore
			return `Bearer ${store.state.userStore.jwt}`;
		}
		return null;
	}
}


export default new ApiService(API_URL);
