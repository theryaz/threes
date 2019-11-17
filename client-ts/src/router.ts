import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home.vue";
import Multiplayer from "./pages/Multiplayer.vue";

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
      path: "/multiplayer",
      name: "multiplayer",
      component: Multiplayer
    }
  ]
});
