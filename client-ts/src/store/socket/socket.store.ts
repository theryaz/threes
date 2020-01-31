import store from '../store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

import * as SocketMutationTypes from './socket.types';
import apiService from '@/services/api.service';


@Module({
	namespaced: true,
	dynamic: true,
	name: 'socketStore',
	store: store
})
export default class SocketModule extends VuexModule{
  isConnected: boolean = false;
  socketId: string | null = null;
  socketError: string | null = null;

  @Action onConnected(){
    // console.log("onConnected");
    const jwt = this.context.rootState.userStore.jwt;
    apiService.socket.emit('jwt', jwt);
    this.context.commit(SocketMutationTypes.CONNECTED, { socketId: apiService.socket.id});
  }
	@Mutation [SocketMutationTypes.CONNECTED]({ socketId }: { socketId: string }){
    this.isConnected = true;
    this.socketId = socketId;
  }
  
  @Action onDisconnected(){
    this.context.commit(SocketMutationTypes.DISCONNECTED);
  }
	@Mutation [SocketMutationTypes.DISCONNECTED](){
		this.isConnected = false;
  }
  
  @Action onEvent(errorMessage: String){
    this.context.commit(SocketMutationTypes.EVENT, errorMessage);
  }
	@Mutation [SocketMutationTypes.EVENT](errorMessage: string){
		this.socketError = errorMessage;
	}
}