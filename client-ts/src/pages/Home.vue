<template>
  <v-container fluid id="home">
    <div class="text-center mb-6">
      <img class="mx-a" src="img/threes-network-v4.png" :height="LogoSize" :width="LogoSize"/>
    </div>
    <div>
      <Game
        auto-size fullscreen
        :game-state="gameStore.singleGameState"
        v-on:gameStart="onGameStart"
        v-on:gameOver="onGameOver"
        v-on:onMove="onMove"
        v-slot:default="{ gameState, size }"
      >
        <v-row>
          <v-col cols="3">
            <ControlsPreview class="ml-4" />
          </v-col>
          <v-col class="d-flex px-6">
            <template v-if="CurrentHint === 0">
              <div class="my-auto flex-grow-1">
                Next Number:
              </div>
              <div class="ma-auto mr-4">
                <Cell
                  :absolute="false"
                  :size="size * 0.7"
                  :value="gameState.nextNumber"
                />
              </div>
            </template>
            <div v-if="CurrentHint === 1" class="my-auto">
              Use the arrow keys to move!
            </div>
          </v-col>
        </v-row>
      </Game>
    </div>
  </v-container>
</template>
<script lang="ts">
import { mapState } from "vuex";
import { getModule } from "vuex-module-decorators";
import { Component, Vue } from "vue-property-decorator";
import PlayerCard from "../components/PlayerCard.vue";
import ControlsPreview from "../components/ControlsPreview.vue";
import Cell from "../components/Game/Cell.vue";

import UserModule from "../store/user/user.store";
const userStore = getModule(UserModule);
import GameModule from "../store/game/game.store";
import * as GameMutationTypes from "../store/game/game.types";
import apiService from "../services/api.service";
import { IGameMove, IGameGridState, IGameOverPayload } from "../model/interfaces";
const gameStore = getModule(GameModule);

@Component({
  components: { Cell, PlayerCard, ControlsPreview },
  computed:{
    ...mapState(["userStore"]),
    ...mapState(["gameStore"]),
  }
})
export default class Home extends Vue {
  get LogoSize(){
    if (this.IsMobile) {
      return 80;
    }
    return 100;
  }
  get IsMobile() {
    return this.$vuetify.breakpoint.mobileBreakpoint;
  }
  get CurrentHint(){
    if (gameStore.singleGameState.history.length < 15) {
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
</style>
