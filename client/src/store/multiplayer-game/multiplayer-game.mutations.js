import * as MultiplayerGameMutationTypes from './multiplayer-game.mutation-types';
export const MultiplayerGameMutations = {
  [MultiplayerGameMutationTypes.HOST_GAME]({multiplayerGameState}){
    multiplayerGameState.isLoading = true;
  },
  [MultiplayerGameMutationTypes.HOST_GAME_SUCCESS]({multiplayerGameState}, payload){
    multiplayerGameState.gameOptions = {
      uuid: payload.uuid,
    };
    multiplayerGameState.isLoading = false;
  },
  [MultiplayerGameMutationTypes.HOST_GAME_FAILURE]({multiplayerGameState}){
    multiplayerGameState.isLoading = false;
    multiplayerGameState.hostError = multiplayerGameState.rror;
  },
};
