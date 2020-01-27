<template>
  <v-container id="multiplayer">
    <v-row>
      <v-col cols="6">
        <Game 
          :keyboardControls="wasdKeys"
          :game-state="gameStore.leftGameState"
          v-on:gameStart="onLeftGameStart"
          v-on:gameOver="onLeftGameOver"
          v-on:onMove="onLeftMove"
        >
          <PlayerCard
            :username="'Ryan'"
            :color="''"
            :avatarIcon="'fa-kiwi-bird'"
            />
          <div v-if="gameStore.leftGameState.gameOver" class="mt-2">
            Score: {{ gameStore.leftGameState.score }}
          </div>
        </Game>
      </v-col>
      <v-col cols="6">
        <Game 
          :keyboardControls="arrowKeys"
          :game-state="gameStore.rightGameState"
          v-on:gameStart="onRightGameStart"
          v-on:gameOver="onRightGameOver"
          v-on:onMove="onRightMove"
        >
          <PlayerCard
            :username="'Krista'"
            :color="''"
            :avatarIcon="'fa-pegasus'"
            />
          <div v-if="gameStore.rightGameState.gameOver" class="mt-2">
            Score: {{ gameStore.rightGameState.score }}
          </div>
        </Game>
      </v-col>
    </v-row>
    
    <!-- <RegisterDialog
    :show="showRegisterDialog"
    v-on:onRegister="onRegister"
    v-on:onContinue="onContinue"
    v-on:onHasAccount="onHasAccount"/> -->
    
    <!-- <LoginDialog
    :show="showLoginDialog"
    v-on:onGoRegister="onGoRegister"
    v-on:onLogin="onLogin"/> -->
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
export default class LocalMultiplayer extends Vue{
  private showRegisterDialog: boolean = false;
  private showLoginDialog: boolean = false;

  get arrowKeys(){
    return {
      moveUp: 38,
      moveDown: 40,
      moveLeft: 37,
      moveRight: 39,
    };
  }
  get wasdKeys(){
    return {
      moveUp: 87,
      moveDown: 83,
      moveLeft: 65,
      moveRight: 68,
    };
  }

  // private localGrid: Grid = new Grid();

  beforeMount(){
    if(userStore.isLoggedIn === false){
      this.showRegisterDialog = true;
    }
  }
  mounted(){
    
  }

  get isPaused(){
    return this.userStore.username === null;
  }
  get userStore(){
    return userStore;
  }

  // Continue without registering
  onContinue({ username }){
    // console.log("[Multiplayer.vue] onContinue");
    userStore.setTempUsername(username);
    this.showRegisterDialog = false;
  }
  onRegister(formData){
    // console.log("[Multiplayer.vue] onRegister", formData);
    userStore.register({
      username: formData.username,
      email: formData.email,
      password: formData.password1,
    });
  }
  onHasAccount(formData){
    // console.log("[Multiplayer.vue] onHasAccount");
    this.showRegisterDialog = false;
    this.showLoginDialog = true;
  }
  onLogin({ email, password }){
    // console.log("[Multiplayer.vue] onLogin");
    userStore.login({ email, password }).then(result => {
      this.showLoginDialog = false;
    });
  }
  onGoRegister(formData){
    // console.log("[Multiplayer.vue] onGoRegister");
    this.showLoginDialog = false;
    this.showRegisterDialog = true;
  }

  onLeftGameStart(initialGridState: IGameGridState){
    console.log("onLeftGameStart", initialGridState);
    gameStore.onLeftGameStart(initialGridState);
  }
  onLeftMove(move: IGameMove){
    // console.log("onLeftMove", move);
    gameStore.onLeftMove(move);
  }
  onLeftGameOver(score: number){
    console.log("onLeftGameOver", score);
    gameStore.onLeftGameOver(score);
  }

  onRightGameStart(initialGridState: IGameGridState){
    console.log("onRightGameStart", initialGridState);
    gameStore.onRightGameStart(initialGridState);
  }
  onRightMove(move: IGameMove){
    // console.log("onRightMove", move);
    gameStore.onRightMove(move);
  }
  onRightGameOver(score: number){
    console.log("onRightGameOver", score);
    gameStore.onRightGameOver(score);
  }
}
</script>
<style lang="scss">
</style>
