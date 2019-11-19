import store from '../store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

import * as SocketMutationTypes from './socket.types';


@Module({
	namespaced: true,
	dynamic: true,
	name: 'socketStore',
	store: store
})
export default class SocketModule extends VuexModule{
  isConnected: boolean = false;
  socketError: string | null = null;

  @Action onConnected(){
    console.log("onConnected");
    this.context.commit(SocketMutationTypes.CONNECTED);
  }
	@Mutation [SocketMutationTypes.CONNECTED](){
    this.isConnected = true;
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