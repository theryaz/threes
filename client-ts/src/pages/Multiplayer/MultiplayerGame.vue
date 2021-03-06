<template>
  <v-container fluid id="MultiplayerGame">
    <v-row>
    <!-- v-bind:class="{ "flex-row-reverse": !isHost }" -->
      <v-col cols="12" md="6">
        <Game
          auto-size
          :show-overlay="GameIsOver && IsMobile"
          :fullscreen="IsMobile"
          :gameState="gameStore.localGameState"
          v-on:gameStart="onLocalGameStart"
          v-on:gameOver="onLocalGameOver"
          v-on:onMove="onLocalMove"
        >
          <template v-slot:default="{ size, gameState }">
            <div class="px-12 py-2">
              <PlayerCard
                class="d-inline-block mr-2"
                :username="userStore.username"
                :color="userStore.color"
                :avatarIcon="userStore.avatarIcon"
              />
              <Cell
                class="d-inline-block"
                :absolute="false"
                :dark="$vuetify.theme.dark"
                :size="size * 0.7"
                :value="gameState.nextNumber"
              />
            </div>
          </template>
          <template v-slot:overlay v-if="IsMobile">
            <BackToLobby
              v-on:click="goBackToLobby"
              :isWinner="isWinner"
              :show="GameIsOver"
            />
          </template>
        </Game>
      </v-col>
      <v-col cols="12" md="6">
        <Game
          :class="{
            'game-mobile-layout': IsMobile,
            'elevation-5': IsMobile,
          }"
          auto-size
          :gameState="gameStore.remoteGameState"
          :remotePlayerInfo="gameStore.remotePlayer"
          v-on:gameStart="onRemoteGameStart"
          v-on:gameOver="onRemoteGameOver"
          v-on:onMove="onRemoteMove"
        >
          <PlayerCard
            :username="gameStore.remotePlayer.username"
            :color="gameStore.remotePlayer.color"
            :avatarIcon="gameStore.remotePlayer.avatarIcon"
          />
        </Game>
      </v-col>
      <v-col class="mt-4 text-center" v-if="!IsMobile">
        <BackToLobby
          v-on:click="goBackToLobby"
          :isWinner="isWinner"
          :show="GameIsOver"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { mapState } from "vuex";
import { getModule } from "vuex-module-decorators";
import { Component, Vue } from "vue-property-decorator";
import Cell from "../../components/Game/Cell.vue";
import PlayerCard from "../../components/PlayerCard.vue";
import RegisterDialog from "../../components/RegisterDialog.vue";
import LoginDialog from "../../components/LoginDialog.vue";
import BackToLobby from "./BackToLobby.vue";

import UserModule from "../../store/user/user.store";
const userStore = getModule(UserModule);

import GameModule from "../../store/game/game.store";
import * as GameMutationTypes from "../../store/game/game.types";
const gameStore = getModule(GameModule);

import MultiplayerModule from "../../store/multiplayer/multiplayer.store";
import * as MultiplayerMutationTypes from "../../store/multiplayer/multiplayer.types";
const multiplayerStore = getModule(MultiplayerModule);

import apiService from "../../services/api.service";
import { PlayerStatus, GameStatus } from "../../model/enums";
import { IGameMove, IGameGridState, ICellValue } from "../../model/interfaces";

@Component({
  components: { BackToLobby, Cell, PlayerCard, RegisterDialog, LoginDialog },
  computed:{
    ...mapState(["userStore"]),
    ...mapState(["gameStore"]),
    ...mapState(["multiplayerStore"]),
  }
})
export default class MultiplayerGame extends Vue {

  private showRegisterDialog: boolean = false;
  private showLoginDialog: boolean = false;

  get IsMobile(): boolean {
    return this.$vuetify.breakpoint.mobile;
  }
  get GameIsOver() {
    return (
      gameStore.localGameState.gameOver && gameStore.remoteGameState.gameOver
    );
  }
  get isWinner(){
    return gameStore.localGameState.score >= gameStore.remoteGameState.score;
  }

  get isWaiting(){
    return gameStore.localGameState.status === GameStatus.WaitingToStart;
  }

  get joinUrl(){
    // TODO configure this properly
    return `${window.location.origin}/join/${gameStore.gameShortId}`;
  }

  get isHost(){
    return gameStore.multiplayerGameStatus === PlayerStatus.HostedGame;
  }
  beforeMount(){
    // console.log("gameStore.multiplayerGameStatus", gameStore.multiplayerGameStatus);
    if (gameStore.multiplayerGameStatus === PlayerStatus.InLobby) {
      this.$router.push("/multiplayer");
    }
  }
  mounted(){
    // console.log("Multiplayer Game Mounted")
  }

  goBackToLobby(){
    this.$router.push("/multiplayer/game");
  }

  get userStore(){
    return userStore;
  }
  get isPaused(){
    return this.userStore.username === null;
  }

  onLocalGameStart(initialGridState: IGameGridState){
    // console.log("onLocalGameStart", initialGridState);
    gameStore.onGameStart(initialGridState);
  }
  onLocalMove(move: IGameMove){
    // console.log("onLocalMove", move);
    gameStore.onMove(move);
  }
  onLocalGameOver({ score, cells }: {score:number,cells: ICellValue[]}){
    console.log("onLocalGameOver", { score, cells });
    gameStore.onGameOver({ score, cells });
  }

  onRemoteGameStart(initialGridState: IGameGridState){
    // console.log("onRemoteGameStart", initialGridState);
    gameStore.onRemoteGameStart(initialGridState);
  }
  onRemoteMove(move: IGameMove){
    // console.log("onRemoteMove", move);
    gameStore.onRemoteMove(move);
  }
  onRemoteGameOver({ score, cells }: {score:number,cells: ICellValue[]}){
    console.log("onRemoteGameOver", { score, cells });
    gameStore.onRemoteGameOver({ score, cells });
  }

  beforeDestroy(){
    gameStore.onExitMultiplayer();
  }
}
</script>
<style lang="scss" scoped>
.game-mobile-layout{
  position: fixed;
  top: 5px;
  right: 5px;
  transform: scale(0.25);
  transform-origin: top right;
}
</style>
