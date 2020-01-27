import store from '../store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

import * as MultiplayerMutationTypes from './multiplayer.types';
import apiService from '../../services/api.service';
import { IPlayer } from '@/model/interfaces';

interface SuccessPayload{
  players: IPlayer[]
}

@Module({
  namespaced: true,
  dynamic: true,
  name: 'multiplayerStore',
  store: store
})
export default class MultiplayerModule extends VuexModule{

  playersLoading: boolean = false;
  playersError: string | null = null;
  players: IPlayer[] = [];
  
  @Action({rawError: true, commit: MultiplayerMutationTypes.SET_USER_LIST}) async getUsers(){
    this.context.commit(MultiplayerMutationTypes.GET_USERS);
    try{
      const response = await apiService.get('/v1/player/list');
      return {
        players: response.body.players.filter((player: IPlayer) => {
          return player.socket !== this.context.rootState.socketStore.socketId;
        })
      };
    }catch(error){
      this.context.commit(MultiplayerMutationTypes.GET_USERS_FAILURE);
      throw error;
    }
  }
  @Action({rawError: true, commit: MultiplayerMutationTypes.ADD_USER}) async addUser({ player }:{ player: IPlayer }){
    if(player.socket !== this.context.rootState.socketStore.socketId) return { player };
  }
  @Mutation [MultiplayerMutationTypes.ADD_USER]({ player }: { player: IPlayer }){
    this.playersLoading = false;
    this.players.push(player);
  }

  @Mutation [MultiplayerMutationTypes.GET_USERS](){
    this.playersLoading = true;
    this.playersError = null;
  }
  @Mutation [MultiplayerMutationTypes.SET_USER_LIST]({ players }: SuccessPayload){
    this.playersLoading = false;
    this.players = [...players];
  }
  @Mutation [MultiplayerMutationTypes.ADD_USER_LIST]({ players }: SuccessPayload){
    this.playersLoading = false;
    this.players = [
      ...this.players,
      ...players,
    ];
  }
  @Mutation [MultiplayerMutationTypes.GET_USERS_FAILURE](errorMessage: string){
    this.playersLoading = false;
    this.playersError = errorMessage;
  }
}