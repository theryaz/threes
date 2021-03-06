<template>
  <v-container id="MultiplayerHome">
    <v-row>
      <v-col cols="12" md="6">
        <v-btn
          @click.stop="showRegister = true"
          height="60"
          width="100%"
          text
          class="text-left"
          v-bind:class="{ 'edit-attention': playerIsDefault }"
        >
          <PlayerCard
            :username="userStore.username"
            :color="userStore.color"
            :avatarIcon="userStore.avatarIcon"
          />
          Edit <v-icon class="ml-2">fal fa-edit</v-icon>
        </v-btn>
        <RegisterDialog
          v-model="showRegister"
          v-on:onClose="showRegister = false"
          v-on:onSetTempUser="onSetTempUser"
          max-width="600"
        />
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn
          class="ma-0"
          color="primary"
          :loading="gameStore.hostGameLoading"
          @click="hostGame"
        >
          Host Game
        </v-btn>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <PlayerList
          :limit="5"
          :playerList="playerList"
          v-on:gameShortId="setGameShortId"
        />
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
import { IPlayerInfo, IGameMove, IGameGridState } from '../../model/interfaces';
import { COLORS } from '../../model/constants';

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
  private showRegister: boolean = false;

  private pollInterval: any = null;

  private autoJoin: boolean = false;

  beforeMount(){
    userStore.loadTempUser();
  }
  mounted(){
    this.getUsers();
    apiService.socket.on(MultiplayerMutationTypes.GET_USERS, this.getUsers);
  }
  beforeUnmount(){
    apiService.socket.removeListener(MultiplayerMutationTypes.GET_USERS);
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

  get playerIsDefault(){
    return userStore.username === "Player";
  }

  hostGame(){
    gameStore.hostGame().then(() => {
      // console.log("Game Hosted!");
      this.$router.push('/multiplayer/game');
    });
  }
  setGameShortId(gameShortId: string){
    this.joinForm.gameShortId = gameShortId;
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
  }
  onRegister(formData: any){
    console.log("[Multiplayer.vue] onRegister", formData);
    userStore.register({
      username: formData.username,
      email: formData.email,
      password: formData.password1,
    });
  }

  get playerList(){
    return multiplayerStore.players;
  }

  onSetTempUser(payload: IPlayerInfo){
    console.log("onSetTempUser", payload);
    userStore.setTempUsername(payload.username);
    userStore.setTempAvatar(payload);
    apiService.socket.emit(UserMutationTypes.SET_USER_INFO, payload);
  }

}
</script>
<style lang="scss">
@import "src/scss/colors";
@keyframes attention-animation {
  0%   {
    transform:  rotateZ(0);
  }
  94%  {
    transform: rotateZ(0);
  }
  96%  {
    transform: rotateZ(2deg);
  }
  98%  {
    transform: rotateZ(-2deg);
  }
  100% {
    transform: rotateZ(0);
  }
}

.edit-attention{
  box-shadow: 2px 2px 10px -8px #000;
  animation-name: attention-animation;
  animation-duration: 6s;
  animation-iteration-count: infinite;
}
</style>
