<template>
  <div class="game-component" :style="componentStyle">
    <v-dialog v-model="grid.gameOver" max-width="290">
      <v-card>
        <v-card-title class="headline">
          <div class="new-high-score" v-if="grid.score == grid.highScore">
            Wow! New high score!
          </div>
          <div v-else class="new-high-score">
            Game over
          </div>
        </v-card-title>
        <v-card-text>
          Score: <strong>{{ grid.score }}</strong>
          <br />
          High Score: {{ grid.highScore }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="initializeGame()">Play Again</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div id="title">
      <table>
        <tr>
          <td class="text-right">
            <slot>
              Next Number:
            </slot>
          </td>
          <td>
            <div id="preview" class="cell">
              <Cell :value="grid.nextNumber" />
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div id="playing-grid" ref="grid">
    </div>
  </div>
</template>

<script lang="ts">

import Cell from './Cell.vue';
import { Grid } from './model/Grid';
import { Component, Vue, Prop } from "vue-property-decorator";
import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';

import UserModule from '../../store/user/user.store';
const userStore = getModule(UserModule);

import { COLORS } from '../../model/constants';

@Component({
  components:{
    Cell
  },
  computed:{
    ...mapState(['userStore']),
  }
})
export default class RemoteGame extends Vue{
  @Prop() private playerConnected: boolean = false;
  @Prop() private grid: Grid;

  created(){
    if(!this.grid){
      console.error("RemoteGame no grid provided as prop!");
      this.grid = new Grid();
    }
  }
  mounted(){
    console.log("Refs", this.$refs);
    this.initializeGame();
  }
  getRandom(min,max){
      return Math.floor(Math.random() * max) + min;
  }
  initializeGame(){
    this.grid.initializeGame(this.$refs.grid, 0);
  }
  get componentStyle(){
    return {
      background: COLORS[this.theme].gameBackground,
    };
  }
  get theme(){
    return this.$vuetify.theme.dark ? 'dark' : 'light';
  }
}
</script>

<style lang="scss">
  @import "src/scss/colors";
  @import "src/scss/buttons";
  @import "src/scss/cell";
  #title{
    height: $height;
    line-height: $height;
    table{
      width: 100%;
      line-height: 1rem;
    }
    font-size: 1.25rem;
    font-weight: bold;
    #preview{
      display: inline-block;
      position: static;
      transform: scale(0.7);
    }
  }

  #playing-grid{
    position: relative;
    width: ($width * 4);
    height: ($height * 4);
    margin: auto;
    border-radius: 2px;
  }

  .game-component{
    width: ($width * 5);
    position: relative;
    margin: auto;
    box-shadow: 0px 0px 5px -2px $shadow;
    text-align: center;
  }
  
  .new-high-score{
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 2px;
  }

</style>
