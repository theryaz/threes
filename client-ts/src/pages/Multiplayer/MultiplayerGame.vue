<template>
  <v-container id="MultiplayerGame">
    <v-row  v-bind:class="{ 'flex-row-reverse': !isHost }">
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
    <v-row v-if="isWaiting">
      <v-col offset="3" cols="6">
        <v-card>
          <v-card-title>
            Invite a friend to start the game!
          </v-card-title>
          <v-card-text>
            <v-chip label><v-icon left>fa-clipboard</v-icon> {{ joinUrl }}</v-chip>
          </v-card-text>
          <v-card-text>
            <br />
            Game Id: <v-chip label>{{ gameStore.gameShortId }}</v-chip>
          </v-card-text>
        </v-card>
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

import UserModule from '../../store/user/user.store';
const userStore = getModule(UserModule);

import GameModule from '../../store/game/game.store';
import * as GameMutationTypes from '../../store/game/game.types';
const gameStore = getModule(GameModule);

import MultiplayerModule from '../../store/multiplayer/multiplayer.store';
import * as MultiplayerMutationTypes from '../../store/multiplayer/multiplayer.types';
const multiplayerStore = getModule(MultiplayerModule);

import apiService from '../../services/api.service';
import { PlayerStatus, GameStatus } from '../../model/enums';
import { IGameMove, IGameGridState, ICellValue } from '../../model/interfaces';

@Component({
  components: { PlayerCard, RegisterDialog, LoginDialog },
  computed:{
    ...mapState(['userStore']),
    ...mapState(['gameStore']),
    ...mapState(['multiplayerStore']),
  }
})
export default class MultiplayerGame extends Vue{
  private showRegisterDialog: boolean = false;
  private showLoginDialog: boolean = false;

  // private localGrid: Grid = new Grid();

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
    console.log("gameStore.multiplayerGameStatus", gameStore.multiplayerGameStatus);
    if(gameStore.multiplayerGameStatus === PlayerStatus.InLobby){
      this.$router.push('/multiplayer');
    }
  }
  mounted(){
    console.log("Multiplayer Game Mounted")
  }

  get userStore(){
    return userStore;
  }
  get isPaused(){
    return this.userStore.username === null;
  }

  onLocalGameStart(initialGridState: IGameGridState){
    console.log("onLocalGameStart", initialGridState);
    gameStore.onGameStart(initialGridState);
  }
  onLocalMove(move: IGameMove){
    console.log("onLocalMove", move);
    gameStore.onMove(move);
  }
  onLocalGameOver({ score, cells }: {score:number,cells: ICellValue[]}){
    gameStore.onGameOver({ score, cells });
  }

  onRemoteGameStart(initialGridState: IGameGridState){
    console.log("onRemoteGameStart", initialGridState);
    gameStore.onRemoteGameStart(initialGridState);
  }
  onRemoteMove(move: IGameMove){
    console.log("onRemoteMove", move);
    gameStore.onRemoteMove(move);
  }
  onRemoteGameOver({ score, cells }: {score:number,cells: ICellValue[]}){
    console.log("onRemoteGameOver", score);
    gameStore.onRemoteGameOver({ score, cells });
  }
}
</script>
<style lang="scss">
</style>
