<template>
  <div class="game-component">
    <div v-if="grid.gameOver || paused" id="game-overlay">
      <div class="card" v-if="grid.gameOver">
        <h3>Score: {{ grid.score }}</h3>
        <h3>High Score: {{ grid.highScore }}</h3>
        <div class="new-high-score" v-if="grid.score == grid.highScore">
          Wow! New high score!
        </div>
        <div class="buttons" v-if="options.isMultiplayer !== true">
          <button class="common primary" v-on:click="initializeGame()">Play Again</button>
        </div>
      </div>
      <div class="card" v-if="paused">
        <h3>Game Paused</h3>
      </div>
    </div>
    <h1 id="title">
      Next Number:
      <div id="preview" class="cell">
        <div :class="grid.getClass(grid.nextNumber)">
          {{grid.nextNumber}}
        </div>
      </div>
    </h1>
    <div id="playing-grid" ref="grid">
    </div>
  </div>
</template>

<script>

import { Grid } from '../model/grid';

export default {
  name: 'Game',
  props:{
    paused: Boolean,
    options: {
      type: Object,
      default: () => {
        return {
          isRemote: false,
          isMultiplayer: false,
        };
      }
    },
  },
  beforeMount(){
    if(this.options.isRemote == true || this.paused == true) return;
    window.addEventListener('keydown', (e) => {
      if(this.grid.gameOver) return;
      e = e || window.event;
      if (e.keyCode == '38') {
        this.grid.moveUp();
      }
      else if (e.keyCode == '40') {
        this.grid.moveDown();
      }
      else if (e.keyCode == '37') {
        this.grid.moveLeft();
      }
      else if (e.keyCode == '39') {
        this.grid.moveRight();
      }
    });

  },
  mounted(){
    console.log("Refs", this.$refs);
    this.initializeGame();
  },
  data() {
    return {
      grid: new Grid()
    }
  },
  methods:{
    getRandom(min,max){
      return Math.floor(Math.random() * max) + min;
    },
    initializeGame(){
      this.grid.initializeGame(this.$refs.grid, 9);
    }
  }
}
</script>

<style lang="scss">
  @import "../scss/colors";
  @import "../scss/buttons";
  @import "../scss/cell";
  #title{
    font-size: 1.5rem;
    #preview{
      display: inline-block;
      position: static;
      transform: scale(0.7);
      border: 1px solid #EFEFEF;
    }
  }
  #playing-grid{
    position: relative;
    background: #EFEFEF;
    width: ($width * 4);
    height: ($height * 4);
    margin: auto;
    border-radius: 2px;
  }

  .game-component{
    position: relative;
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
