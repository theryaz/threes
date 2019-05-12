import Home from './components/Home.vue';
import Game from './components/Game.vue';
import MultiplayerGame from './components/MultiplayerGame.vue';

export const routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: '/play',
    component: Game,
  },
  {
    path: '/multiplayer',
    component: MultiplayerGame,
  },
];
