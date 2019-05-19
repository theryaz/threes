import * as MultiplayerGameMutationTypes from './multiplayer-game.mutation-types';

export const MultiplayerGameMutations = {
  [MultiplayerGameMutationTypes.CANCEL_HOST_GAME]({multiplayerGameState}){
    multiplayerGameState.isConnected = false;
    multiplayerGameState.gameOptions.id = null;
    multiplayerGameState.remotePlayerId = null;
  },
  [MultiplayerGameMutationTypes.HOST_GAME]({multiplayerGameState}){
    multiplayerGameState.isConnected = false;
    multiplayerGameState.isLoading = true;
    multiplayerGameState.remotePlayerId = null;
  },
  [MultiplayerGameMutationTypes.HOST_GAME_SUCCESS]({multiplayerGameState}, payload){
    multiplayerGameState.gameOptions = {
      id: payload.id,
    };
    multiplayerGameState.isLoading = false;
  },
  [MultiplayerGameMutationTypes.HOST_GAME_FAILURE]({multiplayerGameState}){
    multiplayerGameState.isLoading = false;
    multiplayerGameState.hostError = multiplayerGameState.error;
  },
  [MultiplayerGameMutationTypes.JOIN_GAME]({multiplayerGameState}){
    multiplayerGameState.isConnected = false;
    multiplayerGameState.isLoading = true;
    multiplayerGameState.remotePlayerId = null;
    multiplayerGameState.gameOptions = {
      id: null,
    };
  },
  [MultiplayerGameMutationTypes.JOIN_GAME_SUCCESS]({multiplayerGameState}, payload){
    multiplayerGameState.isConnected = true;
    multiplayerGameState.isLoading = false;
    multiplayerGameState.remotePlayerId = payload.remotePlayerId;
    multiplayerGameState.gameOptions = {
      id: payload.gameId,
    };
  },
  [MultiplayerGameMutationTypes.PLAYER_JOINED]({multiplayerGameState}, payload){
    multiplayerGameState.isConnected = true;
    multiplayerGameState.remotePlayerId = payload;
  }
};
