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
  nextNumber: getRandom(1,3),
  ref: null,
  0:{
    0: null,
    1: null,
    2: null,
    3: null,
  },
  1:{
    0: null,
    1: null,
    2: null,
    3: null,
  },
  2:{
    0: null,
    1: null,
    2: null,
    3: null,
  },
  3:{
    0: null,
    1: null,
    2: null,
    3: null,
  },
  Grid: () => {
    // Util to return Grid values only
    return {
      0: Grid[0],
      1: Grid[1],
      2: Grid[2],
      3: Grid[3],
    };
  },
  at(coords){
    return Grid[coords.r][coords.c];
  },
  createCell(coords, value){
    if(!coords){
      coords = {
        row: getRandom(1,3),
        col: getRandom(1,3)
      };
    }
    if(!value){
      value = getRandom(1,3);
    }
    console.log("Create Cell", coords, value);
    let c = new CellComponent({
      propsData:{
        row: coords.row,
        col: coords.col,
        value: value,
      }
    });
    return c;
  },
  spawnCellInGrid(cell){
    if(Grid[cell.row][cell.col] != null) return false;
    cell.$mount();
    Grid[cell.row][cell.col] = cell;
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
    console.log("Grid Initialized", Grid.Grid());
  },
  clear(coords){
    let cell = Grid.at(coords);
    if(cell === null) return false;
    cell.destroy();
    Grid[coords.r][coords.c] = null;
  },
  valueAt(coords){
    if(coords.r > 3 || coords.r < 0 || coords.c > 3 || coords.c < 0) return -1;
    if(Grid[coords.r][coords.c] == null) return 0;
    else return Grid[coords.r][coords.c].value;
  },
  above(coords){
    let new_coords = {r: coords.r - 1, c: coords.c};
    // console.log("above",coords, new_coords);
    if(Grid.valueAt(new_coords) >= 0){
      return {coords: new_coords, cell: Grid[coords.r - 1][coords.c]};
    }else{
      return {coords: new_coords, cell: {value: -1}};
    }
  },
  below(coords){
    let new_coords = {r: coords.r + 1, c: coords.c};
    // console.log("above",coords, new_coords);
    if(Grid.valueAt(new_coords) >= 0){
      return {coords: new_coords, cell: Grid[coords.r + 1][coords.c]};
    }else{
      return {coords: new_coords, cell: {value: -1}};
    }
  },
  left(coords){
    let new_coords = {r: coords.r, c: coords.c - 1};
    // console.log("above",coords, new_coords);
    if(Grid.valueAt(new_coords) >= 0){
      return {coords: new_coords, cell: Grid[coords.r][coords.c - 1]};
    }else{
      return {coords: new_coords, cell: {value: -1}};
    }
  },
  right(coords){
    let new_coords = {r: coords.r, c: coords.c + 1};
    // console.log("above",coords, new_coords);
    if(Grid.valueAt(new_coords) >= 0){
      return {coords: new_coords, cell: Grid[coords.r][coords.c + 1]};
    }else{
      return {coords: new_coords, cell: {value: -1}};
    }
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
    // Grid.right({r: 0, c: 0}) = {coords: {r: 0, c: 1}, value: x}
    // We then check if the cell at coords can be moved into the cellAt the desired direction
    let startCell = Grid.at(coords);
    let destCell = cellAt(coords).cell;
    if(startCell == null) return;

    console.log("startCell", startCell);
    console.log("destCell", destCell);
    if(destCell == null){
      console.log("startCell[direction]();", direction);// Target Cell is Empty
      startCell[direction]();
      return;
    }
    if(destCell.value == -1) return; // -1 means not a valid coordinate
    let destCoords = {
      r: destCell.row,
      c: destCell.col,
    }

    if(Grid.valueAt(coords) >= 3){
      if(destCell.value == Grid.valueAt(coords)){
        // console.log(`${destCell.value} == ${Grid.valueAt(coords)}`);
        startCell.setValue(destCell.value * 2);
        console.log("startCell[direction]();", direction);
        startCell[direction]();
        return Grid.clear(destCoords);
      }
    }else if(Grid.valueAt(coords) == 2 && destCell.value == 1){
      startCell.setValue(3);
      console.log("startCell[direction]();", direction);
      startCell[direction]();
      return Grid.clear(destCoords);
    }else if(Grid.valueAt(coords) == 1 && destCell.value == 2){
      // console.log(`${destCell.value} == 2 && ${Grid.valueAt(coords)} == 1)`);
      startCell.setValue(3);
      console.log("startCell[direction]();", direction);
      startCell[direction]();
      return Grid.clear(destCoords);
    }else{
      // console.log(`No Valid Move: ${Grid.above(coords).value} == ${Grid.valueAt(coords)}`);
    }
  },
  moveUp(){
    // console.log("moveUp");
    Grid.topToBottom(Grid.above);
    // Grid.addNumberUp();
  },
  moveDown(){
    console.log("moveDown");
    Grid.bottomToTop(Grid.below);
    // Grid.addNumberDown();
  },
  moveLeft(){
    // console.log("moveLeft");
    Grid.leftToRight(Grid.left);
    // Grid.addNumberLeft();
  },
  moveRight(){
    // console.log("moveRight");
    Grid.rightToLeft(Grid.right);
    // Grid.addNumberRight();
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
      let targetCell = options[getRandom(0,options.length)];
      Grid.set(targetCell, Grid.nextNumber);
      Grid.nextNumber = getRandom(1,3);
      // console.log("Number Added to",targetCell);
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
