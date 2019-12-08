<template>
  <v-container id="multiplayer">
    <v-row>
      <v-col cols="6">
        <Game 
          :game-state="gameStore.localGameState"
          v-on:gameStart="onLocalGameStart"
          v-on:gameOver="onLocalGameOver"
          v-on:onMove="onLocalMove"
        >
          <PlayerCard
            :username="userStore.username"
            :color="userStore.color"
            :avatarIcon="userStore.avatarIcon"
            />
        </Game>
      </v-col>
      <v-col cols="6">
        <Game
          :game-state="gameStore.remoteGameState"
          v-on:gameStart="onRemoteGameStart"
          v-on:gameOver="onRemoteGameOver"
          v-on:onMove="onRemoteMove">
          <PlayerCard
            :username="gameStore.remotePlayer.username"
            :color="gameStore.remotePlayer.color"
            :avatarIcon="gameStore.remotePlayer.avatarIcon"
          />
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
import GameModule from '../store/game/game.store';
import * as GameMutationTypes from '../store/game/game.types';
import apiService from '../services/api.service';
import { IGameMove, IGameGridState } from '../model/interfaces';
const gameStore = getModule(GameModule);

@Component({
  components: { PlayerCard, RegisterDialog, LoginDialog },
  computed:{
    ...mapState(['userStore']),
    ...mapState(['gameStore']),
  }
})
export default class Multiplayer extends Vue{
  private showRegisterDialog: boolean = false;
  private showLoginDialog: boolean = false;

  // private localGrid: Grid = new Grid();

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

  onLocalGameStart(initialGridState: IGameGridState){
    console.log("onLocalGameStart", initialGridState);
    gameStore.onGameStart(initialGridState);
  }
  onLocalMove(move: IGameMove){
    console.log("onLocalMove", move);
    gameStore.onMove(move);
  }
  onLocalGameOver(score: number){
    gameStore.onGameOver(score);
  }

  onRemoteGameStart(initialGridState: IGameGridState){
    console.log("onRemoteGameStart", initialGridState);
    gameStore.onRemoteGameStart(initialGridState);
  }
  onRemoteMove(move: IGameMove){
    console.log("onRemoteMove", move);
    gameStore.onRemoteMove(move);
  }
  onRemoteGameOver(score: number){
    console.log("onRemoteGameOver", score);
    gameStore.onRemoteGameOver(score);
  }
}
</script>
<style lang="scss">
</style>
