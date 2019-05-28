import * as GameListMutationTypes from './game-list.mutation-types';

export const GameListMutations = {
  [GameListMutationTypes.LOAD_GAMES]({gameListState}, payload){
    gameListState.isLoading = true;
  },
  [GameListMutationTypes.LOAD_GAMES_SUCCESS]({gameListState}, payload){
    gameListState.isLoading = false;
    gameListState.gameList = [...payload];
  },
  [GameListMutationTypes.LOAD_GAMES_FAILURE]({gameListState}, payload){
    gameListState.isLoading = false;
    gameListState.gameList = [];
    gameListState.gameListError = payload;
  },
  [GameListMutationTypes.GAME_LIST_UPDATE]({gameListState}, payload){
    gameListState.gameList = [...payload];
  },
};
