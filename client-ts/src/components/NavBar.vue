<template>
  <v-bottom-navigation
    absolute
    grow
    horizontal
    color="primary"
  >
    <v-btn to="/" value="play" height="100%">
      <span>Play</span>
      <v-icon>fa-gamepad</v-icon>
    </v-btn>
    
    <v-btn to="/local-multiplayer" value="local" height="100%">
      <span>Local</span>
      <v-icon>fa-user-friends</v-icon>
    </v-btn>

    <v-btn to="/multiplayer" value="online" height="100%">
      <span>Online</span>
      <v-icon>fa-users</v-icon>
    </v-btn>

    <v-menu
      top
      :offset-y="true"
      origin="center bottom"
      transition="scale-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" value="settings" height="100%">
          <span>Settings</span>
          <v-icon>fa-cog</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="logout">
           <v-list-item-icon>
            <v-icon>fa-sign-out</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

  </v-bottom-navigation>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import UserModule from '../store/user/user.store';
const userStore = getModule(UserModule);

@Component
export default class NavBar extends Vue{
  logout(){
    userStore.logout().then(() => {
      this.$router.push('/');
    });
  }
}
</script>