import Vue from 'vue'
import App from './App.vue'

import Cell from './components/Cell.vue';

const CellComponent = Vue.extend(Cell);
// const cell = new CellComponent();

Vue.config.productionTip = false
const indexes = [0,1,2,3];
const r_indexes = [3,2,1,0];

function getRandom(min,max){
  return Math.floor(Math.random() * max) + min;
}
const DIRECTION = {
  UP: 'moveUp',
  DOWN: 'moveDown',
  LEFT: 'moveLeft',
  RIGHT: 'moveRight',
};
const Grid = {
  score: 0,
  valueCount: (value) => {
    return Grid.cells
    .map(cell => cell.value)
    .reduce((a, b) => {
      if(b === value) return a + 1;
      else return a;
    }, 0);
  },
  nextNumber: getRandom(1,3),
  getNextNumber: () => {
    let nextNumber = Grid.nextNumber;

    let ones = (100 - (Grid.valueCount(1) * 20));
    let twos = (100 - (Grid.valueCount(2) * 20));
    let seed = getRandom(0, 100);

    console.log(`${ones}% ones`);
    console.log(`${twos}% twos`);
    console.log(`${seed} rolled`);
    if(seed < ones && seed < twos){
      if(ones > twos) Grid.nextNumber = 1;
      else Grid.nextNumber = 2;
    }else if (seed < twos) {
      Grid.nextNumber = 2;
    }else if (seed < ones){
      Grid.nextNumber = 1;
    }else{
      Grid.nextNumber = 3;
    }
    console.log("Selected",Grid.nextNumber);
    // Grid.nextNumber = getRandom(1,3);
    return nextNumber;
  },
  ref: null,
  cells: [],
  at(coords, index = false){
    let fn = 'find';
    if(index === true) fn = 'findIndex';
    return Grid.cells[fn](cell => cell.isAt(coords));
  },
  createCell(coords, value){
    if(!coords){
      coords = {
        r: getRandom(1,3),
        c: getRandom(1,3)
      };
    }
    if(!value){
      value = getRandom(1,3);
    }
    // console.log("Create Cell", coords, value);
    let c = new CellComponent({
      propsData:{
        row: coords.r,
        col: coords.c,
        value: value,
      }
    });
    return c;
  },
  spawnCellInGrid(cell){
    if(Grid.at({r: cell.row, c: cell.col}) != null) return false;
    cell.$mount();
    Grid.cells.push(cell);
    Grid.ref.appendChild(cell.$el);
    return true;
  },
  initializeGame(gridRef, n = 9){
    Grid.ref = gridRef;
    Grid.score = 0;
    for(let i = 0; i < n; i++){
      let cell = Grid.createCell();
      Grid.spawnCellInGrid(cell);
    }
    console.log("Grid Initialized", Grid.cells);
  },
  clear(coords){
    let cellIndex = Grid.at(coords, true);
    let cell = Grid.cells[cellIndex].destroy();
    Grid.cells.splice(cellIndex, 1);
  },
  coordsOutOfBounds(coords){
    return (coords.r > 3 || coords.r < 0 || coords.c > 3 || coords.c < 0);
  },
  valueAt(coords){
    if(Grid.coordsOutOfBounds(coords)) return -1;
    let cell = Grid.at(coords);
    if(cell == null) return 0;
    else return cell.value;
  },
  above(coords){
    let new_coords = {r: coords.r - 1, c: coords.c};
    return Grid.at(new_coords);
  },
  below(coords){
    let new_coords = {r: coords.r + 1, c: coords.c};
    return Grid.at(new_coords);
  },
  left(coords){
    let new_coords = {r: coords.r, c: coords.c - 1};
    return Grid.at(new_coords);
  },
  right(coords){
    let new_coords = {r: coords.r, c: coords.c + 1};
    return Grid.at(new_coords);
  },
  // Methods to scan the grid from corner to corner and exec the move method on each cell
  topToBottom(cellAt){
    // iterate top left to bottom right
    for(let r of indexes){
      for(let c of indexes){
        Grid.moveDirection(cellAt, {r,c}, DIRECTION.UP);
      }
    }
  },
  bottomToTop(cellAt){
    // iterate top left to bottom right
    for(let r of r_indexes){
      for(let c of r_indexes){
        Grid.moveDirection(cellAt, {r,c}, DIRECTION.DOWN);
      }
    }
  },
  leftToRight(cellAt){
    // iterate bottom left to top right
    for(let r of r_indexes){
      for(let c of indexes){
        Grid.moveDirection(cellAt, {r,c}, DIRECTION.LEFT);
      }
    }
  },
  rightToLeft(cellAt){
    // iterate top left to bottom right
    for(let r of indexes){
      for(let c of r_indexes){
        Grid.moveDirection(cellAt, {r,c}, DIRECTION.RIGHT);
      }
    }
  },
  moveDirection(cellAt, coords, direction){
    // cellAt is a is one of above, below, left, or right to return that cell
    // relative to the provided coords.

    let startCell = Grid.at(coords);
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

    if(Grid.valueAt(coords) >= 3 && destCell.value == Grid.valueAt(coords)){
      console.log("Combining",startCell.value,"to",destCell.value);
      Grid.clear(destCoords);
      startCell.value = destCell.value * 2;
      startCell[direction]();
      return;

    }else if(Grid.valueAt(coords) == 2 && destCell.value == 1){
      console.log("Combining",startCell.value,"to",destCell.value);
      Grid.clear(destCoords);
      startCell.value = 3;
      startCell[direction]();
      return;

    }else if(Grid.valueAt(coords) == 1 && destCell.value == 2){

      console.log("Combining",startCell.value,"to",destCell.value);
      Grid.clear(destCoords);
      startCell.value = 3;
      startCell[direction]();
      return;

    }else{
      // console.log(`No Valid Move: ${Grid.above(coords).value} == ${Grid.valueAt(coords)}`);
    }
  },
  moveUp(){
    // console.log("moveUp");
    Grid.topToBottom(Grid.above);
    Grid.addNumberUp();
  },
  moveDown(){
    console.log("moveDown");
    Grid.bottomToTop(Grid.below);
    Grid.addNumberDown();
  },
  moveLeft(){
    // console.log("moveLeft");
    Grid.leftToRight(Grid.left);
    Grid.addNumberLeft();
  },
  moveRight(){
    // console.log("moveRight");
    Grid.rightToLeft(Grid.right);
    Grid.addNumberRight();
  },
  addNumberUp(){
    let options = [];
    let r = 3;
    for(let c of indexes){
      let coords = {r,c};
      if(Grid.valueAt(coords) == 0){
        options.push(coords);
      }
    }
    Grid.addNumberTo(options);
  },
  addNumberDown(){
    let options = [];
    let r = 0;
    for(let c of indexes){
      let coords = {r,c};
      if(Grid.valueAt(coords) == 0){
        options.push(coords);
      }
    }
    Grid.addNumberTo(options);
  },
  addNumberLeft(){
    // console.log("addNumberLeft");
    let options = [];
    let c = 3;
    for(let r of indexes){
      let coords = {r,c};
      if(Grid.valueAt(coords) == 0){
        options.push(coords);
      }
    }
    Grid.addNumberTo(options);
  },
  addNumberRight(){
    let options = [];
    let c = 0;
    for(let r of indexes){
      let coords = {r,c};
      if(Grid.valueAt(coords) == 0){
        options.push(coords);
      }
    }
    Grid.addNumberTo(options);
  },
  addNumberTo(options){
    // console.log("addNumberTo",options);
    if(options.length > 0){
      let targetCoords = options[getRandom(0,options.length)];
      let cell = Grid.createCell(targetCoords, Grid.getNextNumber());
      Grid.spawnCellInGrid(cell);
      // console.log("Number Add to",targetCoords);
    }
  },
  getClass(value){
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
const applicationState = {
  grid: Grid
};

Vue.mixin({
  data(){
    return{
      state: applicationState
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
