<template>
  <div class="game-component" :style="componentStyle">
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
              <Cell :value="gameState.nextNumber" />
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
import { Vuetify, VuetifyObject } from 'vuetify';
import { ICoords, IGameState, ICellValue } from '../../model/interfaces';
import { ICell } from '../../model/views';
import { Direction, INDEXES, R_INDEXES } from './model/constants';

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
  $refs:{
    grid: HTMLDivElement,
  };
  $vuetify: VuetifyObject;

  @Prop({type: Object}) private gameState: IGameState;
  
  gameOverCheckTimeout: NodeJS.Timeout | null  = null;
  cells: ICell[]  = [];
  nextNumber: number;

  beforeMount(){
    // console.log("Game.vue Grid");
    if(!this.gameState.keyboardEnabled) return;
    window.addEventListener('keydown', (e) => {
      if(this.gameState.paused == true ) return;
      if(this.gameState.gameOver) return;
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
    return this.cells
      .map((cell: ICell) => cell.value)
      .reduce((a,b) => {
        if(b < 3){
          return a;
        }else{
          return a + this.scoreValue(b);
        }
      });
  }
  scoreValue(value: number){
    // 3^(log₂(x/3)+1)
    return Math.pow(3,Math.log2(value / 3) + 1);
  }
  gameOverCheck(){
    if(this.gameOverCheckTimeout) clearTimeout(this.gameOverCheckTimeout);
    this.gameOverCheckTimeout = setTimeout(() => {
      console.log("Check Game Over");
      let gameOver = false;
      if(this.cells.length < 16){
        console.log("The grid isn't even full.");
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
        console.log("Game Over!");
        this.$emit('gameOver', { score: this.getScore(), cells: this.cells });
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
  emitNextNumber(){
    let nextNumber = 1;
    let ones = (100 - (this.valueCount(1) * 20));
    let twos = (100 - (this.valueCount(2) * 20));
    let seed = getRandom(0, 100);

    // console.log(`${ones}% ones`);
    // console.log(`${twos}% twos`);
    // console.log(`${seed} rolled`);
    if(seed < ones && seed < twos){
      if(ones > twos) nextNumber = 1;
      else nextNumber = 2;
    }else if (seed < twos) {
      nextNumber = 2;
    }else if (seed < ones){
      nextNumber = 1;
    }else{
      nextNumber = 3;
    }
    console.log("Selected", nextNumber);
    
    this.$emit('nextNumber', nextNumber);
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
    this.cells.map((cell: ICell) => cell.destroy());
    this.cells = [];
    for(let i = 0; i < numberOfCells; i++){
      let cell = this.createRandomCell();
      this.spawnCellInGrid(cell);
    }
    this.emitNextNumber();
    this.$emit('gameStart', { cells: this.cells });
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
        this.moveDirection(cellAt, {r,c}, Direction.UP);
      }
    }
  }
  bottomToTop(cellAt: (c: ICoords) => ICell){
    // iterate top left to bottom right
    for(let r of R_INDEXES){
      for(let c of R_INDEXES){
        this.moveDirection(cellAt, {r,c}, Direction.DOWN);
      }
    }
  }
  leftToRight(cellAt: (c: ICoords) => ICell){
    // iterate bottom left to top right
    for(let r of R_INDEXES){
      for(let c of INDEXES){
        this.moveDirection(cellAt, {r,c}, Direction.LEFT);
      }
    }
  }
  rightToLeft(cellAt: (c: ICoords) => ICell){
    // iterate top left to bottom right
    for(let r of INDEXES){
      for(let c of R_INDEXES){
        this.moveDirection(cellAt, {r,c}, Direction.RIGHT);
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
      if(this.valueAt({r,c}) !== 0) continue;
      let coords = { r, c, value: this.valueAt({r: r-1,c})};
      options.push(coords);
    }
    this.addNumberToSide(options);
  }
  addNumberDown(){
    let options = [];
    let r = 0;
    for(let c of INDEXES){
      if(this.valueAt({r,c}) !== 0) continue;
      let coords = { r, c, value: this.valueAt({r:r+1,c})};
      options.push(coords);
    }
    this.addNumberToSide(options);
  }
  addNumberLeft(){
    // console.log("addNumberLeft");
    let options = [];
    let c = 3;
    for(let r of INDEXES){
      if(this.valueAt({r,c}) !== 0) continue;
      let coords = { r, c, value: this.valueAt({r,c:c-1})};
      options.push(coords);
    }
    this.addNumberToSide(options);
  }
  addNumberRight(){
    let emptyCells: ICellValue[] = [];
    let nextRow: ICellValue[] = [];
    let c = 0;
    for(let r of INDEXES){
      if(this.valueAt({r,c}) !== 0) continue;
      let coords = { r, c, value: this.valueAt({r,c:c+1})};
      emptyCells.push(coords);
    }
    this.addNumberToSide(emptyCells);
  }
  addNumberToSide(emptyCells: ICellValue[]){
    console.log("addNumberToSide", emptyCells);
    if(emptyCells.length > 0){
      let targetIndex;
      
      switch(this.gameState.nextNumber){
        case 1:
          targetIndex = emptyCells.findIndex(c => c.value === 2);
          break;
        case 2:
          targetIndex = emptyCells.findIndex(c => c.value === 1);
          break;
        default:
          targetIndex = emptyCells.findIndex(c => c.value === this.gameState.nextNumber);
          break;
      }
      if(targetIndex === -1){
        targetIndex = getRandom(0,emptyCells.length);
      }
      let targetCoords = emptyCells[targetIndex];
      let cell = this.createCell(targetCoords, this.gameState.nextNumber);
      this.spawnCellInGrid(cell);
      this.emitNextNumber();
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