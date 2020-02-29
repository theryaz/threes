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
		// console.log("ApiService Initialized baseUrl: ", this.baseUrl);
		this.setupSocketIO();
	}

	setupSocketIO(){
		this.socket.on(SocketMutationTypes.CONNECTED, socketStore.onConnected);
		this.socket.on(SocketMutationTypes.DISCONNECTED, socketStore.onDisconnected);
		this.socket.on(SocketMutationTypes.EVENT, socketStore.onEvent);
		
		this.socket.on(GameMutationTypes.SET_REMOTE_PLAYER_INFO, gameStore.onSetRemotePlayerInfo);
		this.socket.on(GameMutationTypes.GAME_START, gameStore.onGameStart);
		this.socket.on(GameMutationTypes.REMOTE_PLAYER_EXIT, gameStore.onRemotePlayerExit);
	}


	get(uri: string, headers={}){
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
			Authorization: this.getAuthHeader(),
		};
		return Http.get(`${this.baseUrl}${uri}`, { headers });
	}
	post(uri: string, payload: {[field:string]: any}, headers={}){
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
			Authorization: this.getAuthHeader(),
		};
		return Http.post(`${this.baseUrl}${uri}`, payload, { headers });
	}
	put(uri: string, payload: {[field:string]: any}, headers={}){
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
			Authorization: this.getAuthHeader(),
		};
		return Http.put(`${this.baseUrl}${uri}`, payload, { headers });
	}
	delete(uri: string, headers={}){
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
			Authorization: this.getAuthHeader(),
		};
		return Http.delete(`${this.baseUrl}${uri}`, { headers });
	}
	download(uri: string, headers={}, method='get'){
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
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
