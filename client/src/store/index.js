import { MultiplayerGameState, MultiplayerGameMutations, MultiplayerGameActions } from './multiplayer-game';
import { GameListState, GameListMutations, GameListActions } from './game-list';

export const Store = {
  state: {
    multiplayerGameState: MultiplayerGameState,
    gameListState: GameListState,
  },
  mutations: {
    ...MultiplayerGameMutations,
    ...GameListMutations,
  },
  actions:{
    ...MultiplayerGameActions,
    ...GameListActions,
  }
};
