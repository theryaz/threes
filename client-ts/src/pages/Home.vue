<template>
  <v-container id="home">
    <v-row>
      <v-col>
        <Game
          :game-state="gameStore.singleGameState"
          v-on:gameStart="onGameStart"
          v-on:gameOver="onGameOver"
          v-on:onMove="onMove"
        >
          <v-layout>
            <v-flex>
              <ControlsPreview />
            </v-flex>
            <v-flex v-show="CurrentHint === 0">
              Next Number:
            </v-flex>
            <v-flex v-show="CurrentHint === 1">
              Use the arrow keys to move!
            </v-flex>
          </v-layout>
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
import ControlsPreview from '../components/ControlsPreview.vue';

import UserModule from '../store/user/user.store';
const userStore = getModule(UserModule);
import GameModule from '../store/game/game.store';
import * as GameMutationTypes from '../store/game/game.types';
import apiService from '../services/api.service';
import { IGameMove, IGameGridState, IGameOverPayload } from '../model/interfaces';
const gameStore = getModule(GameModule);

@Component({
  components: { PlayerCard, ControlsPreview },
  computed:{
    ...mapState(['userStore']),
    ...mapState(['gameStore']),
  }
})
export default class Home extends Vue{
  get CurrentHint(){
    if(gameStore.singleGameState.history.length < 15){
      return 1;
    }
    return 0;
  }

  onGameStart(initialGridState: IGameGridState){
    // console.log("onSingleGameStart", initialGridState);
    gameStore.onSingleGameStart(initialGridState);
  }
  onMove(move: IGameMove){
    // console.log("onSingleMove", move);
    gameStore.onSingleMove(move);
  }
  onGameOver({ score, cells }: IGameOverPayload){
    gameStore.onSingleGameOver({ score, cells });
  }
}
</script>
<style lang="scss">
  @import "../scss/colors";
  @import "../scss/buttons";

  #home{
    height: 100vh;
    display: flex;
    box-sizing: border-box;
    padding: 10px;
    flex-direction: column;
    .body{
      flex-grow: 1;
    }
  }
  button.common{
    margin: 2.0rem 1.0rem;
  }
  .body{
    table{
      margin: auto;
      max-width: 400px;
      ul{
        padding: 5px;
      }
      li{
        // list-style: none;
        padding: 5px;
        text-align: left;
      }
    }
    img#preview{
      height: 200px;
    }
  }
</style>
