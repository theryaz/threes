<template>
  <v-container id="multiplayer">
    <v-row>
      <v-col cols="6">
        <Game :paused="isPaused">
          <PlayerCard :username="userStore.username" />
        </Game>
      </v-col>
      <v-col cols="6">
        <Game :isRemote="true">
          <PlayerCard :username="'Wolf'" color="pink" avatarIcon="fa-dog"/>
        </Game>
      </v-col>
    </v-row>
    
    <RegisterDialog
    :show="showRegisterDialog"
    v-on:onRegister="onRegister"
    v-on:onContinue="onContinue"
    v-on:onHasAccount="onHasAccount"/>
    
    <LoginDialog
    :show="showLoginDialog"
    v-on:onGoRegister="onGoRegister"
    v-on:onLogin="onLogin"/>
  </v-container>
</template>
<script lang="ts">
import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import { Component, Vue } from 'vue-property-decorator';
import PlayerCard from '../components/PlayerCard.vue';
import RegisterDialog from '../components/RegisterDialog.vue';
import LoginDialog from '../components/LoginDialog.vue';

import UserModule from '../store/user/user.store';
const userStore = getModule(UserModule);

@Component({
  components: { PlayerCard, RegisterDialog, LoginDialog },
  computed:{
    ...mapState(['userStore']),
  }
})
export default class Multiplayer extends Vue{
  private showRegisterDialog: boolean = false;
  private showLoginDialog: boolean = false;

  beforeMount(){
    if(userStore.isLoggedIn === false){
      this.showRegisterDialog = true;
    }
  }
  mounted(){
    console.log("[Multiplayer.vue] Auto Join game");
  }

  get isPaused(){
    return this.userStore.username === null;
  }
  get userStore(){
    return userStore;
  }

  // Continue without registering
  onContinue({ username }){
    console.log("[Multiplayer.vue] onContinue");
    userStore.setTempUsername(username);
    this.showRegisterDialog = false;
  }
  onRegister(formData){
    console.log("[Multiplayer.vue] onRegister");
  }
  onHasAccount(formData){
    console.log("[Multiplayer.vue] onHasAccount");
    this.showRegisterDialog = false;
    this.showLoginDialog = true;
  }
  onLogin({ email, password }){
    console.log("[Multiplayer.vue] onLogin");
    userStore.login({ email, password }).then(result => {
      this.showLoginDialog = false;
    });
  }
  onGoRegister(formData){
    console.log("[Multiplayer.vue] onGoRegister");
    this.showLoginDialog = false;
    this.showRegisterDialog = true;
  }
}
</script>
<style lang="scss">
</style>
