import socketClient from '../../socketClient';
import * as GameListMutationTypes from './game-list.mutation-types';

export const GameListActions = {
  // Actions recieve a 'context' object.
  // We can destructure the commit method from it.
  [GameListMutationTypes.LOAD_GAMES]({commit}){
    commit(GameListMutationTypes.LOAD_GAMES);
    socketClient.send('loadGames');
  },
};
