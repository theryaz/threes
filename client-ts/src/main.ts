import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import vuetify from './plugins/vuetify';

import './scss/styles.scss';

Vue.config.productionTip = false;

import Game from './components/Game/Game.vue';
Vue.component('Game', Game);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
