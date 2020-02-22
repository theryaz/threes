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

    <v-btn @click.stop="showRegister = true" value="online" height="100%">
      <PlayerCard
        :username="userStore.username"
        :color="userStore.color"
        :avatarIcon="userStore.avatarIcon"
      />
    </v-btn>

    <RegisterDialog
      v-model="showRegister"
      v-on:onClose="showRegister = false"
      v-on:onSetTempUser="onSetTempUser"
      max-width="600"
    />
  </v-bottom-navigation>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import UserModule from '../store/user/user.store';
const userStore = getModule(UserModule);

import PlayerCard from '../components/PlayerCard.vue';
import RegisterDialog from '../components/RegisterDialog.vue';
import { IPlayerInfo } from '../model/interfaces';

@Component({
  components: { PlayerCard, RegisterDialog },
  computed:{
    ...mapState(['userStore']),
  }
})
export default class NavBar extends Vue{
  
  private showRegister: boolean = true;

  logout(){
    userStore.logout().then(() => {
      this.$router.push('/');
    });
  }

  onSetTempUser(payload: IPlayerInfo){
    console.log("onSetTempUser", payload);
    userStore.setTempUsername(payload.username);
    userStore.setTempAvatar(payload);
  }
}
</script>