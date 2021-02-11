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

const FALLBACK_URL = 'http://192.168.132.125:4280'

class ApiService{
	useFallback: boolean = false;
	get ApiUrl(): string{
		if (this.useFallback) return FALLBACK_URL
		return this.baseUrl;
	}
	public socket: SocketIOClient.Socket = io.connect(this.ApiUrl);
	constructor(private baseUrl: string){
		console.log("ApiService Initialized baseUrl: ", this.baseUrl);
		this.setupBackendApi();
	}

	async setupBackendApi(): Promise<void>{
		const res = await Http.get(`${this.ApiUrl}/healthcheck`).catch(() => null);
		const isAlive = res !== null && res.status === 200;
		if(!isAlive){
			this.useFallback = true;
		}
		const res2 = await Http.get(`${FALLBACK_URL}/healthcheck`).catch(() => null);
		const altIsAlive = res2 !== null && res2.status === 200;
		if (!altIsAlive){
			this.socket.disconnect();
			socketStore.setOffline();
			return;
		}else{
			console.log("Using fallback API", { apiUrl: this.ApiUrl });
		}
		this.setupSocketIO(this.ApiUrl);
	}

	setupSocketIO(apiUrl?: string){
		if (apiUrl){
			this.socket.disconnect();
			this.socket = io.connect(apiUrl);
		}
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
		return Http.get(`${this.ApiUrl}${uri}`, { headers });
	}
	post(uri: string, payload: {[field:string]: any}, headers={}){
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
			Authorization: this.getAuthHeader(),
		};
		return Http.post(`${this.ApiUrl}${uri}`, payload, { headers });
	}
	put(uri: string, payload: {[field:string]: any}, headers={}){
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
			Authorization: this.getAuthHeader(),
		};
		return Http.put(`${this.ApiUrl}${uri}`, payload, { headers });
	}
	delete(uri: string, headers={}){
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
			Authorization: this.getAuthHeader(),
		};
		return Http.delete(`${this.ApiUrl}${uri}`, { headers });
	}
	download(uri: string, headers={}, method='get'){
		headers = {
			...headers,
			['x-client-id']: this.socket.id,
			Authorization: this.getAuthHeader(),
		};
		return Http[method](`${this.ApiUrl}${uri}`, { headers, responseTye: 'arraybuffer' });
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
