import Vue from 'vue'
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import App from './App.vue'
import { routes } from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

Vue.config.productionTip = false
Vue.use(Vuex);

import { Store } from './store';
const store = new Vuex.Store(Store);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
