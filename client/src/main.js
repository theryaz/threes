import Vue from 'vue'
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import './scss/styles.scss';
import App from './App.vue'
import Game from './components/Game.vue'
import GameList from './components/GameList.vue'
Vue.component('Game', Game);
Vue.component('GameList', GameList);


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

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
