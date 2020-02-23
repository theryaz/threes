<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
    <NavBar />
  </v-app>
</template>
<script lang="ts">
import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import { Component, Vue } from 'vue-property-decorator';
import NavBar from './components/NavBar.vue';

import UserModule from './store/user/user.store';
const userStore = getModule(UserModule);

@Component({
  components: { NavBar }
})
export default class App extends Vue{
  beforeMount(){
    const useDarkMode = window.localStorage.getItem("useDarkMode") == 'true' ? true : false;
    this.$vuetify.theme.dark = useDarkMode;
    userStore.loadAuth();
  }
}
</script>