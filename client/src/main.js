import Vue from 'vue'
import Vuex from 'vuex';

import App from './App.vue'

Vue.config.productionTip = false
Vue.use(Vuex);

import { Store } from './store';
const store = new Vuex.Store(Store);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
