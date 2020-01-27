import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home.vue";
import LocalMultiplayer from "./pages/LocalMultiplayer.vue";
import MultiplayerRoot from "./pages/Multiplayer/MultiplayerRoot.vue";
import MultiplayerHome from "./pages/Multiplayer/MultiplayerHome.vue";
import MultiplayerGame from "./pages/Multiplayer/MultiplayerGame.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/local-multiplayer",
      name: "local-multiplayer",
      component: LocalMultiplayer
    },
    {
      path: "/multiplayer",
      name: "MultiplayerRoot",
      component: MultiplayerRoot,
      children:[
        {
          path: '/multiplayer',
          name: "MultiplayerHome",
          component: MultiplayerHome,
        },
        {
          path: '/multiplayer/game',
          name: "MultiplayerGame",
          component: MultiplayerGame,
        }
      ]
    }
  ]
});
