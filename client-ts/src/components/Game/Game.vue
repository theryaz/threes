<template>
  <div class="game-component" :style="componentStyle">
     <v-dialog v-model="gameOver" max-width="290">
      <v-card>
        <v-card-title class="headline">
          <div class="new-high-score" v-if="score == highScore">
            Wow! New high score!
          </div>
          <div v-else class="new-high-score">
            Game over
          </div>
        </v-card-title>
        <v-card-text>
          Score: <strong>{{ score }}</strong>
          <br />
          High Score: {{ highScore }}
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
              <Cell :value="nextNumber" />
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
import { ICoords } from '../../model/interfaces';
import { ICell } from '../../model/views';
import { DIRECTION, INDEXES, R_INDEXES } from './model/constants';

import Cell from './Cell.vue';
import { Component, Vue, Prop } from "vue-property-decorator";
import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';

import UserModule from '../../store/user/user.store';
const userStore = getModule(UserModule);

import { COLORS } from '../../model/constants';

function getRandom(min: number, max: number){
  return Math.floor(Math.random() * max) + min;
}

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

  gameOverCheckTimeout: number | null  = null;
  highScore: number  = 0;
  score: number  = 0;
  gameOver: boolean  = false;
  cells: ICell[]  = [];
  nextNumber: any  = getRandom(1,3);

  $refs!:{
    grid: any,
  };
  $vuetify!: any;

  beforeMount(){
    // console.log("Game.vue Grid");
    if(this.isRemote) return;
    window.addEventListener('keydown', (e) => {
      if(this.paused == true ) return;
      if(this.gameOver) return;
      e = e || window.event;
      if (e.keyCode == 38) {
        this.moveUp();
        this.$emit('moveUp');
      }
      else if (e.keyCode == 40) {
        this.moveDown();
        this.$emit('moveDown');
      }
      else if (e.keyCode == 37) {
        this.moveLeft();
        this.$emit('moveLeft');
      }
      else if (e.keyCode == 39) {
        this.moveRight();
        this.$emit('moveRight');
      }
    });
  }
  mounted(){
    // console.log("Refs", this.$refs);
    this.initializeGame();
  }
  getRandom(min,max){
      return Math.floor(Math.random() * max) + min;
  }
  get componentStyle(){
    return {
      background: COLORS[this.theme].gameBackground,
    };
  }
  get theme(){
    return this.$vuetify.theme.dark ? 'dark' : 'light';
  }

  getScore(){
    let score = this.score = this.cells
    .map((cell: ICell) => cell.value)
    .reduce((a,b) => {
      if(b < 3){
        return a;
      }else{
        return a + this.scoreValue(b);
      }
    });
    this.setHighScore(score);
  }
  scoreValue(value: number){
    // 3^(log₂(x/3)+1)
    let score = Math.pow(3,Math.log2(value / 3) + 1);
    // console.log(`Calculated ${value} as worth ${score} points`);
    return score;
  }
  setHighScore(score: number){
    let highScore = +localStorage.getItem('highScore');
    if(!highScore) highScore = 100;
    if(score > highScore){
      this.highScore = score;
      localStorage.setItem('highScore', score);
    }else{
      this.highScore = highScore;
      localStorage.setItem('highScore', highScore);
    }
  }
  gameOverCheck(){
    if(this.gameOverCheckTimeout) clearTimeout(this.gameOverCheckTimeout);
    this.gameOverCheckTimeout = setTimeout(() => {
      // console.log("Check Game Over");
      let gameOver = false;
      if(this.cells.length < 16){
        // console.log("The grid isn't even full.");
        return;
      }

      let allCellsStuck = true;
      for(let cell of this.cells){
        if(allCellsStuck != true) break;
        let adjacentCells = [
          this.above(cell.coords()),
          this.below(cell.coords()),
          this.left(cell.coords()),
          this.right(cell.coords()),
        ];
        adjacentCells = adjacentCells.filter(x => (x !== undefined && x !== null));
        if(cell.value === 1){
          for(let adjacentCell of adjacentCells){
            if(adjacentCell.value === 2){
              allCellsStuck = false;
              break;
            }
          }
        }else if(cell.value === 2){
          for(let adjacentCell of adjacentCells){
            if(adjacentCell.value === 1){
              allCellsStuck = false;
              break;
            }
          }
        }else{
          for(let adjacentCell of adjacentCells){
            if(adjacentCell.value === cell.value){
              allCellsStuck = false;
              break;
            }
          }
        }
      }
      if(allCellsStuck){
        // console.log("Game Over!");
        this.getScore();
        this.gameOver = allCellsStuck;
      }
    }, 1000);
  }
  valueCount(value: number){
    return this.cells
    .map(cell => cell.value)
    .reduce((a, b) => {
      if(b === value) return a + 1;
      else return a;
    }, 0);
  }
  setNextNumber(){
    let nextNumber = this.nextNumber;

    let ones = (100 - (this.valueCount(1) * 20));
    let twos = (100 - (this.valueCount(2) * 20));
    let seed = getRandom(0, 100);

    // console.log(`${ones}% ones`);
    // console.log(`${twos}% twos`);
    // console.log(`${seed} rolled`);
    if(seed < ones && seed < twos){
      if(ones > twos) this.nextNumber = 1;
      else this.nextNumber = 2;
    }else if (seed < twos) {
      this.nextNumber = 2;
    }else if (seed < ones){
      this.nextNumber = 1;
    }else{
      this.nextNumber = 3;
    }
    // console.log("Selected",this.nextNumber);
    // this.nextNumber = getRandom(1,3);
    return nextNumber;
  }
  at(coords: ICoords): ICell | undefined{
    return this.cells.find(cell => cell.isAt(coords));
  }
  indexAt(coords: ICoords): number | undefined{
    return this.cells.findIndex(cell => cell.isAt(coords));
  }
  createRandomCell(){
    return this.createCell({
      r: getRandom(0,3),
      c: getRandom(0,3),
    }, getRandom(1,3));
  }
  createCell(coords: ICoords, value: number){
    // console.log("Create Cell", coords, value);
    let c = <ICell> new Cell();
    c.row = coords.r;
    c.col = coords.c;
    c.value = value;
    c.grid = this;
    // console.log("Created Cell", c);
    return c;
  }
  spawnCellInGrid(cell: ICell){
    if(this.at({r: cell.row, c: cell.col}) != null) return false;
    cell.$mount();
    this.cells.push(cell);
    this.$refs.grid.appendChild(cell.$el);
    return true;
  }
  initializeGame(numberOfCells: number = 9){
    // console.log("[Grid.ts] initialize Game gridRef: " + gridRef);
    this.score = 0;
    this.cells.map((cell: ICell) => cell.destroy());
    this.cells = [];
    this.gameOver = false;
    for(let i = 0; i < numberOfCells; i++){
      let cell = this.createRandomCell();
      this.spawnCellInGrid(cell);
    }
    // console.log("Grid Initialized", this.cells);
  }
  clear(coords: ICoords){
    let cellIndex = this.indexAt(coords);
    if(cellIndex === undefined) return;
    let cell = this.cells[cellIndex].destroy();
    this.cells.splice(cellIndex, 1);
  }
  coordsOutOfBounds(coords: ICoords){
    return (coords.r > 3 || coords.r < 0 || coords.c > 3 || coords.c < 0);
  }
  valueAt(coords: ICoords){
    if(this.coordsOutOfBounds(coords)) return -1;
    let cell = this.at(coords);
    if(cell == null) return 0;
    else return cell.value;
  }
  above(coords: ICoords): ICell{
    let new_coords = {r: coords.r - 1, c: coords.c};
    return this.at(new_coords);
  }
  below(coords: ICoords): ICell{
    let new_coords = {r: coords.r + 1, c: coords.c};
    return this.at(new_coords);
  }
  left(coords: ICoords): ICell{
    let new_coords = {r: coords.r, c: coords.c - 1};
    return this.at(new_coords);
  }
  right(coords: ICoords): ICell{
    let new_coords = {r: coords.r, c: coords.c + 1};
    return this.at(new_coords);
  }
  // Methods to scan the grid from corner to corner and exec the move method on each cell
  topToBottom(cellAt: (c: ICoords) => ICell){
    // iterate top left to bottom right
    for(let r of INDEXES){
      for(let c of INDEXES){
        this.moveDirection(cellAt, {r,c}, DIRECTION.UP);
      }
    }
  }
  bottomToTop(cellAt: (c: ICoords) => ICell){
    // iterate top left to bottom right
    for(let r of R_INDEXES){
      for(let c of R_INDEXES){
        this.moveDirection(cellAt, {r,c}, DIRECTION.DOWN);
      }
    }
  }
  leftToRight(cellAt: (c: ICoords) => ICell){
    // iterate bottom left to top right
    for(let r of R_INDEXES){
      for(let c of INDEXES){
        this.moveDirection(cellAt, {r,c}, DIRECTION.LEFT);
      }
    }
  }
  rightToLeft(cellAt: (c: ICoords) => ICell){
    // iterate top left to bottom right
    for(let r of INDEXES){
      for(let c of R_INDEXES){
        this.moveDirection(cellAt, {r,c}, DIRECTION.RIGHT);
      }
    }
  }
  moveDirection(cellAt, coords, direction){
    // cellAt is a is one of above, below, left, or right to return that cell
    // relative to the provided coords.

    let startCell = this.at(coords);
    let destCell = cellAt(coords);
    if(startCell == null) return;

    // console.log("startCell", startCell);
    // console.log("destCell", destCell);
    if(destCell == null){
      startCell[direction]();
      return;
    }
    if(destCell.value == -1) return; // -1 means not a valid coordinate
    let destCoords = {
      r: destCell.row,
      c: destCell.col,
    };

    if(this.valueAt(coords) >= 3 && destCell.value == this.valueAt(coords)){
      // console.log("Combining",startCell.value,"to",destCell.value);
      this.clear(destCoords);
      startCell.value = destCell.value * 2;
      startCell[direction]();
      return;

    }else if(this.valueAt(coords) == 2 && destCell.value == 1){
      // console.log("Combining",startCell.value,"to",destCell.value);
      this.clear(destCoords);
      startCell.value = 3;
      startCell[direction]();
      return;

    }else if(this.valueAt(coords) == 1 && destCell.value == 2){

      // console.log("Combining",startCell.value,"to",destCell.value);
      this.clear(destCoords);
      startCell.value = 3;
      startCell[direction]();
      return;

    }else{
      // console.log(`No Valid Move ${direction}`);
    }
  }
  moveUp(){
    // console.log("moveUp");
    this.topToBottom(this.above);
    this.addNumberUp();
    this.gameOverCheck();
  }
  moveDown(){
    // console.log("moveDown");
    this.bottomToTop(this.below);
    this.addNumberDown();
    this.gameOverCheck();
  }
  moveLeft(){
    // console.log("moveLeft");
    this.leftToRight(this.left);
    this.addNumberLeft();
    this.gameOverCheck();
  }
  moveRight(){
    // console.log("moveRight");
    this.rightToLeft(this.right);
    this.addNumberRight();
    this.gameOverCheck();
  }
  addNumberUp(){
    let options = [];
    let r = 3;
    for(let c of INDEXES){
      let coords = {r,c};
      if(this.valueAt(coords) == 0){
        options.push(coords);
      }
    }
    this.addNumberTo(options);
  }
  addNumberDown(){
    let options = [];
    let r = 0;
    for(let c of INDEXES){
      let coords = {r,c};
      if(this.valueAt(coords) == 0){
        options.push(coords);
      }
    }
    this.addNumberTo(options);
  }
  addNumberLeft(){
    // console.log("addNumberLeft");
    let options = [];
    let c = 3;
    for(let r of INDEXES){
      let coords = {r,c};
      if(this.valueAt(coords) == 0){
        options.push(coords);
      }
    }
    this.addNumberTo(options);
  }
  addNumberRight(){
    let options = [];
    let c = 0;
    for(let r of INDEXES){
      let coords = {r,c};
      if(this.valueAt(coords) == 0){
        options.push(coords);
      }
    }
    this.addNumberTo(options);
  }
  addNumberTo(options){
    // console.log("addNumberTo",options);
    if(options.length > 0){
      let targetCoords = options[getRandom(0,options.length)];
      let cell = this.createCell(targetCoords, this.setNextNumber());
      this.spawnCellInGrid(cell);
      // console.log("Number Add to",targetCoords);
    }
  }
  getClass(value: number){
    if(value === 1){
      return 'blue';
    }else if(value === 2){
      return 'red';
    }else if(value === 3){
      return 'white';
    }else if(value === 0){
      return 'empty';
    }
  }
};
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
    height: ($height * 5.4);
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