import { MultiplayerGameState, MultiplayerGameMutations, MultiplayerGameActions } from './multiplayer-game';

export const Store = {
  state: {
    multiplayerGameState: MultiplayerGameState,
  },
  mutations: {
    ...MultiplayerGameMutations,
  },
  actions:{
    ...MultiplayerGameActions,
  }
};
