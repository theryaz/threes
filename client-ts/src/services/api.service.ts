// @ts-ignore
import { Http } from 'vue-resource';
import { getModule } from 'vuex-module-decorators';
import io from 'socket.io-client';
import { API_URL } from '../model/config';

import store from '../store/store';
import SocketModule from '../store/socket/socket.store';
import * as SocketMutationTypes from '../store/socket/socket.types';
const socketStore = getModule(SocketModule);

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
