import { ICoords } from '../../../model/interfaces';
import { ICell } from '../../../model/views';
import { DIRECTION, INDEXES, R_INDEXES } from './constants';

import Cell from '../Cell.vue';

function getRandom(min: number, max: number){
  return Math.floor(Math.random() * max) + min;
}

export class Grid{
  private gameOverCheckTimeout: number | null;
  private highScore: number;
  private score: number;
  public gameOver: boolean;
  public ref: any;
  private cells: ICell[];
  private nextNumber: any;

  constructor(remote=false){
    console.log("Initialized Grid!");
    this.gameOverCheckTimeout = null;
    this.highScore = 0;
    this.score = 0;
    this.gameOver = false;
    this.ref = null;
    this.cells = [];
    this.nextNumber = getRandom(1,3);
  }

  applyCellState(cellState: ICell[]){
    console.log("Applying Cell State", cellState);
    if(cellState.length != this.cells.length){
      console.error("Cell lengths do not match", cellState, this.cells);
    }
    for(let i in this.cells){
      this.cells[i].row = cellState[i].row;
      this.cells[i].col = cellState[i].col;
      this.cells[i].value = cellState[i].value;
    }
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
          this.above(this, cell.coords()),
          this.below(this, cell.coords()),
          this.left(this, cell.coords()),
          this.right(this, cell.coords()),
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
  at(self: Grid, coords: ICoords): ICell | undefined{
    return this.cells.find(cell => cell.isAt(coords));
  }
  indexAt(self: Grid, coords: ICoords): number | undefined{
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
    if(this.at(this, {r: cell.row, c: cell.col}) != null) return false;
    cell.$mount();
    this.cells.push(cell);
    this.ref.appendChild(cell.$el);
    return true;
  }
  initializeGame(gridRef: HTMLDivElement, n = 9){
    // console.log("[Grid.ts] initialize Game gridRef: " + gridRef);
    this.ref = gridRef;
    this.score = 0;
    this.cells.map((cell: ICell) => cell.destroy());
    this.cells = [];
    this.gameOver = false;
    for(let i = 0; i < n; i++){
      let cell = this.createRandomCell();
      this.spawnCellInGrid(cell);
    }
    // console.log("Grid Initialized", this.cells);
  }
  clear(coords: ICoords){
    let cellIndex = this.indexAt(this, coords);
    if(cellIndex === undefined) return;
    let cell = this.cells[cellIndex].destroy();
    this.cells.splice(cellIndex, 1);
  }
  coordsOutOfBounds(coords: ICoords){
    return (coords.r > 3 || coords.r < 0 || coords.c > 3 || coords.c < 0);
  }
  valueAt(coords: ICoords){
    if(this.coordsOutOfBounds(coords)) return -1;
    let cell = this.at(this, coords);
    if(cell == null) return 0;
    else return cell.value;
  }
  above(self: Grid, coords: ICoords): ICell{
    let new_coords = {r: coords.r - 1, c: coords.c};
    return self.at(self, new_coords);
  }
  below(self: Grid, coords: ICoords): ICell{
    let new_coords = {r: coords.r + 1, c: coords.c};
    return self.at(self, new_coords);
  }
  left(self: Grid, coords: ICoords): ICell{
    let new_coords = {r: coords.r, c: coords.c - 1};
    return self.at(self, new_coords);
  }
  right(self: Grid, coords: ICoords): ICell{
    let new_coords = {r: coords.r, c: coords.c + 1};
    return self.at(self, new_coords);
  }
  // Methods to scan the grid from corner to corner and exec the move method on each cell
  topToBottom(cellAt: ICell){
    // iterate top left to bottom right
    for(let r of INDEXES){
      for(let c of INDEXES){
        this.moveDirection(cellAt, {r,c}, DIRECTION.UP);
      }
    }
  }
  bottomToTop(cellAt: ICell){
    // iterate top left to bottom right
    for(let r of R_INDEXES){
      for(let c of R_INDEXES){
        this.moveDirection(cellAt, {r,c}, DIRECTION.DOWN);
      }
    }
  }
  leftToRight(cellAt: ICell){
    // iterate bottom left to top right
    for(let r of R_INDEXES){
      for(let c of INDEXES){
        this.moveDirection(cellAt, {r,c}, DIRECTION.LEFT);
      }
    }
  }
  rightToLeft(cellAt: ICell){
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

    let startCell = this.at(this, coords);
    let destCell = cellAt(this, coords);
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
