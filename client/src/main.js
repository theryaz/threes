import Vue from 'vue'
import VueRouter from 'vue-router';
import Vuex from 'vuex';

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
  routes
});

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
