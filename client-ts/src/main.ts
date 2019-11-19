import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import "./registerServiceWorker";
import vuetify from './plugins/vuetify';
// import './scss/styles.scss';

Vue.config.productionTip = false;

import Game from './components/Game/Game.vue';
Vue.component('Game', Game);

import RemoteGame from './components/Game/RemoteGame.vue';
Vue.component('RemoteGame', RemoteGame);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
