import Vue from 'vue'
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueSocketIO from 'vue-socket.io';

import './scss/styles.scss';
import App from './App.vue'
import Game from './components/Game.vue'
Vue.component('Game', Game);


Vue.use(Vuex);
import { Store } from './store';
const store = new Vuex.Store(Store);

import { routes } from './routes';
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  routes
});

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'localhost:9090',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  }
}));

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
