import * as MultiplayerGameMutationTypes from './multiplayer-game.mutation-types';

export const MultiplayerGameActions = {
  // Actions recieve a 'context' object.
  // We can destructure the commit method from it.
  [MultiplayerGameMutationTypes.HOST_GAME]({commit}){
    commit(MultiplayerGameMutationTypes.HOST_GAME);
    setTimeout(() => {
      commit(MultiplayerGameMutationTypes.HOST_GAME_SUCCESS, {uuid: "12345"});
    }, 1000);
  },
};
