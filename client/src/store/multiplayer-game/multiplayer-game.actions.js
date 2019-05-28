import socketClient from '../../socketClient';
import * as MultiplayerGameMutationTypes from './multiplayer-game.mutation-types';

export const MultiplayerGameActions = {
  // Actions recieve a 'context' object.
  // We can destructure the commit method from it.
  [MultiplayerGameMutationTypes.HOST_GAME]({commit}){
    commit(MultiplayerGameMutationTypes.HOST_GAME);
    socketClient.send("hostGame");
  },
  [MultiplayerGameMutationTypes.JOIN_GAME]({commit}, payload){
    commit(MultiplayerGameMutationTypes.JOIN_GAME);
    socketClient.send("joinGame", {gameId: payload});
  },
};
