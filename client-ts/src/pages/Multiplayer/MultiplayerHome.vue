<template>
  <v-container id="MultiplayerHome">
    <RegisterDialog
    :show="showRegisterDialog"
    v-on:onRegister="onRegister"
    v-on:onContinue="onContinue"
    v-on:onHasAccount="onHasAccount"/>
    <LoginDialog
    :show="showLoginDialog"
    v-on:onGoRegister="onGoRegister"
    v-on:onLogin="onLogin"/>

  <v-row dense>
    <!-- <v-col>
      <v-spacer>
      </v-spacer>
      <v-switch
        inset
        flat
        class="ma-0"
        color="primary"
        v-model="autoJoin">
        <template v-slot:label>
          <v-chip label outlined>
            Auto Join
            <template>
              <v-progress-circular
                color="primary"
                :indeterminate="autoJoin"
                :value="0"
                size="24"
                class="ml-2">
              </v-progress-circular>
            </template>
          </v-chip>
        </template>
      </v-switch>
    </v-col> -->
    <v-col sm="12" md="6">
      <v-form v-model="joinFormValid" @submit="joinGame">
        <v-text-field
          solo
          flat
          required
          label="Game Id"
          :rules="gameIdRules"
          v-model="joinForm.gameShortId"
        >
          <template v-slot:append>
            <v-btn
              tile
              text
              class="ma-0"
              color="blue"
              type="submit"
              :disabled="!joinFormValid"
            > Join Game </v-btn>
          </template>
        </v-text-field>

        <v-snackbar
          v-model="joinFormSnackbar"
          top
          color="error"
          :timeout="5000"
        >
          {{ gameStore.joinGameError }}
          <v-btn
            dark
            text
            @click="joinFormSnackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-form>
    </v-col>
    <v-col sm="12" md="6" class="text-right">
      <v-btn
        class="ma-0"
        color="primary"
        :loading="gameStore.hostGameLoading"
      @click="hostGame"> Host Game </v-btn>
    </v-col>
  </v-row>

  <v-row dense>
    <v-col cols="12">
      <PlayerList :limit="5" :playerList="playerList" />
    </v-col>
  </v-row>

  </v-container>
</template>
<script lang="ts">
import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import { Component, Vue } from 'vue-property-decorator';
import PlayerCard from '../../components/PlayerCard.vue';
import RegisterDialog from '../../components/RegisterDialog.vue';
import LoginDialog from '../../components/LoginDialog.vue';
import PlayerList from '../../components/PlayerList.vue';

import UserModule from '../../store/user/user.store';
import * as UserMutationTypes from '../../store/user/user.types';
const userStore = getModule(UserModule);

import GameModule from '../../store/game/game.store';
import * as GameMutationTypes from '../../store/game/game.types';
const gameStore = getModule(GameModule);

import MultiplayerModule from '../../store/multiplayer/multiplayer.store';
import * as MultiplayerMutationTypes from '../../store/multiplayer/multiplayer.types';
const multiplayerStore = getModule(MultiplayerModule);

import apiService from '../../services/api.service';
import { IGameMove, IGameGridState } from '../../model/interfaces';

@Component({
  components: { PlayerCard, RegisterDialog, LoginDialog, PlayerList },
  computed:{
    ...mapState(['userStore']),
    ...mapState(['gameStore']),
    ...mapState(['multiplayerStore']),
  }
})
export default class MultiplayerHome extends Vue{
  private joinFormSnackbar: boolean = false;
  private joinFormValid: boolean = false;
  private joinForm = {
    gameShortId: "",
  };
  private showRegisterDialog: boolean = false;
  private showLoginDialog: boolean = false;

  private pollInterval: any = null;

  private autoJoin: boolean = false;

  beforeMount(){
    if(userStore.isLoggedIn === false && !userStore.username){
      this.showRegisterDialog = true;
    }
  }
  mounted(){
    this.getUsers();
    apiService.socket.on(MultiplayerMutationTypes.GET_USERS, this.getUsers);
    apiService.socket.on(UserMutationTypes.SET_TEMP_AVATAR, userStore.setTempAvatar);
  }
  beforeUnmount(){
    apiService.socket.removeListener(MultiplayerMutationTypes.GET_USERS);
    apiService.socket.removeListener(UserMutationTypes.SET_TEMP_AVATAR);
  }
  getUsers(){
    multiplayerStore.getUsers();
  }

  get gameIdRules(){
    return [
      v => v.length <= 6 || 'Maximum 6 characters',
      v => !!v || '',
    ];
  }

  hostGame(){
    gameStore.hostGame().then(() => {
      // console.log("Game Hosted!");
      this.$router.push('/multiplayer/game');
    });
  }
  joinGame($event){
    $event.preventDefault();
    gameStore.joinGame(this.joinForm.gameShortId).then((success) => {
      if(success){
        // console.log("Joined Game!");
        this.$router.push('/multiplayer/game');
      }else{
        this.joinFormSnackbar = true;
      }
    });
  }

  // Continue without registering
  onContinue({ username }){
    console.log("[Multiplayer.vue] onContinue");
    userStore.setTempUsername(username);
    this.showRegisterDialog = false;
  }
  onRegister(formData){
    console.log("[Multiplayer.vue] onRegister", formData);
    userStore.register({
      username: formData.username,
      email: formData.email,
      password: formData.password1,
    });
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

  get playerList(){
    return multiplayerStore.players;
  }

}
</script>
<style lang="scss">
</style>
