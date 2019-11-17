<template>
  <div class="game-component" :style="componentStyle">
    <div v-if="grid.gameOver" id="game-overlay">
      <div class="card" v-if="grid.gameOver">
        <h3>Score: {{ grid.score }}</h3>
        <h3>High Score: {{ grid.highScore }}</h3>
        <div class="new-high-score" v-if="grid.score == grid.highScore">
          Wow! New high score!
        </div>
        <div class="buttons" v-if="isMultiplayer !== true">
          <button class="common primary" v-on:click="initializeGame()">Play Again</button>
        </div>
      </div>
    </div>
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
export default class Game extends Vue{
  @Prop({type: Boolean, default: false}) private paused: boolean;
  @Prop({type: Boolean, default: false}) private isRemote: boolean;
  @Prop({type: Boolean, default: false}) private isMultiplayer: boolean;
  private grid = new Grid();

  beforeMount(){
    console.log("Game.vue Grid: ", this.grid);
    if(this.isRemote) return;
    window.addEventListener('keydown', (e) => {
      if(this.paused == true ) return;
      if(this.grid.gameOver) return;
      e = e || window.event;
      if (e.keyCode == 38) {
        this.grid.moveUp();
      }
      else if (e.keyCode == 40) {
        this.grid.moveDown();
      }
      else if (e.keyCode == 37) {
        this.grid.moveLeft();
      }
      else if (e.keyCode == 39) {
        this.grid.moveRight();
      }
    });

  }
  mounted(){
    console.log("Refs", this.$refs);
    this.initializeGame();
  }
  getRandom(min,max){
      return Math.floor(Math.random() * max) + min;
  }
  initializeGame(){
    this.grid.initializeGame(this.$refs.grid, 9);
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
  #game-overlay{
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(1, 1, 1, 0.2);
    width: 100%;
    height: 100%;
    z-index: 1000;
    border-radius: 5px;
    text-align: center;
    display: flex;
    div.card{
      display: flex;
      flex-direction: column;
      background-color: $background;
      margin: auto;
      padding: 10px;
      border-radius: 5px;
      min-width: $size * 3;
      min-height: $size * 3;
      box-shadow: 2px 2px 20px -1px #333;
      h3{
        flex-grow: 1;
      }
      div.buttons{
        margin: 1.0rem 0;
      }
    }
  }

  .new-high-score{
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 2px;
  }

</style>
