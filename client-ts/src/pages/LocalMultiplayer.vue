<template>
  <v-container fluid id="multiplayer">
    <v-row>
      <v-col cols="6">
        <Game
          auto-size
          :keyboardControls="wasdKeys"
          :game-state="gameStore.leftGameState"
          v-on:gameStart="onLeftGameStart"
          v-on:gameOver="onLeftGameOver"
          v-on:onMove="onLeftMove"
        >
          <PlayerCard
            :username="'WASD'"
            color="purple"
            :avatarIcon="'fa-kiwi-bird'"
          />
        </Game>
      </v-col>
      <v-col cols="6">
        <Game
          auto-size
          :keyboardControls="arrowKeys"
          :game-state="gameStore.rightGameState"
          v-on:gameStart="onRightGameStart"
          v-on:gameOver="onRightGameOver"
          v-on:onMove="onRightMove"
        >
          <PlayerCard
            :username="'Arrows'"
            color="red"
            :avatarIcon="'fa-pegasus'"
            />
        </Game>
      </v-col>
    </v-row>
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
import { IGameMove, IGameGridState, IGameOverPayload } from '../model/interfaces';
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

  onLeftGameStart(initialGridState: IGameGridState){
    // console.log("onLeftGameStart", initialGridState);
    gameStore.onLeftGameStart(initialGridState);
  }
  onLeftMove(move: IGameMove){
    // console.log("onLeftMove", move);
    gameStore.onLeftMove(move);
  }
  onLeftGameOver({ score, cells }: IGameOverPayload){
    // console.log("onLeftGameOver", score);
    gameStore.onLeftGameOver({ score, cells });
  }

  onRightGameStart(initialGridState: IGameGridState){
    // console.log("onRightGameStart", initialGridState);
    gameStore.onRightGameStart(initialGridState);
  }
  onRightMove(move: IGameMove){
    // console.log("onRightMove", move);
    gameStore.onRightMove(move);
  }
  onRightGameOver({ score, cells }: IGameOverPayload){
    // console.log("onRightGameOver", score);
    gameStore.onRightGameOver({ score, cells });
  }
}
</script>
<style lang="scss">
</style>
