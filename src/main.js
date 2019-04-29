import Vue from 'vue'
import App from './App.vue'

import Cell from './components/Cell.vue';

Vue.component('my-cell', Cell);

Vue.config.productionTip = false
const indexes = [0,1,2,3];
function getRandom(min,max){
  return Math.floor(Math.random() * max) + min;
};
var Grid = {
  nextNumber: getRandom(1,3),
  0:{
    0:0,
    1:0,
    2:0,
    3:0,
  },
  1:{
    0:0,
    1:0,
    2:0,
    3:0,
  },
  2:{
    0:0,
    1:0,
    2:0,
    3:0,
  },
  3:{
    0:0,
    1:0,
    2:0,
    3:0,
  },
  clear(coords){
    Grid.set(coords,0);
  },
  set(coords, newValue){
    // console.log("set",coords, newValue);
    if(coords.r >=0 && coords.r <= 3 && coords.c >= 0 && coords.c <= 3){
      return Grid[coords.r][coords.c] = newValue;
    }
  },
  valueAt(coords){
    if(coords.r >=0 && coords.r <= 3 && coords.c >= 0 && coords.c <= 3){
      // console.log("valueAt",coords,Grid[coords.r][coords.c]);
      return Grid[coords.r][coords.c];
    }else{
      return -1;
    }
  },
  above(coords){
    let new_coords = {r: coords.r - 1, c: coords.c};
    // console.log("above",coords, new_coords);
    if(Grid.valueAt(new_coords) >= 0){
      return {coords: new_coords, value: Grid[coords.r - 1][coords.c]};
    }else{
      return {coords: new_coords, value: -1};
    }
  },
  below(coords){
    let new_coords = {r: coords.r + 1, c: coords.c};
    // console.log("above",coords, new_coords);
    if(Grid.valueAt(new_coords) >= 0){
      return {coords: new_coords, value: Grid[coords.r + 1][coords.c]};
    }else{
      return {coords: new_coords, value: -1};
    }
  },
  left(coords){
    let new_coords = {r: coords.r, c: coords.c - 1};
    // console.log("above",coords, new_coords);
    if(Grid.valueAt(new_coords) >= 0){
      return {coords: new_coords, value: Grid[coords.r][coords.c - 1]};
    }else{
      return {coords: new_coords, value: -1};
    }
  },
  right(coords){
    let new_coords = {r: coords.r, c: coords.c + 1};
    // console.log("above",coords, new_coords);
    if(Grid.valueAt(new_coords) >= 0){
      return {coords: new_coords, value: Grid[coords.r][coords.c + 1]};
    }else{
      return {coords: new_coords, value: -1};
    }
  },
  moveDirection(cellAt){
    for(let r of indexes){
      for(let c of indexes){
        let coords = {r,c};
        if(Grid.valueAt(coords) == 0) continue;
        if(cellAt(coords).value == -1) continue;
        if(cellAt(coords).value == 0){
          Grid.set(cellAt(coords).coords, Grid.valueAt(coords));
          Grid.clear(coords);
        }

        if(Grid.valueAt(coords) >= 3){
          if(cellAt(coords).value == Grid.valueAt(coords)){
            // console.log(`${cellAt(coords).value} == ${Grid.valueAt(coords)}`);
            Grid.set(cellAt(coords).coords, cellAt(coords).value * 2);
            Grid.clear(coords);
          }
        }else if(Grid.valueAt(coords) == 2 && cellAt(coords).value == 1){
          Grid.set(cellAt(coords).coords, 3);
          Grid.clear(coords);
        }else if(Grid.valueAt(coords) == 1 && cellAt(coords).value == 2){
          // console.log(`${cellAt(coords).value} == 2 && ${Grid.valueAt(coords)} == 1)`);
          Grid.set(cellAt(coords).coords, 3);
          Grid.clear(coords);
        }else{
          // console.log(`No Valid Move: ${Grid.above(coords).value} == ${Grid.valueAt(coords)}`);
        }

      }
    }
  },
  moveUp(){
    // console.log("moveUp");
    Grid.moveDirection(Grid.above);
    Grid.addNumberUp();
  },
  moveDown(){
    // console.log("moveDown");
    Grid.moveDirection(Grid.below);
    Grid.addNumberDown();
  },
  moveLeft(){
    // console.log("moveLeft");
    Grid.moveDirection(Grid.left);
    Grid.addNumberLeft();
  },
  moveRight(){
    // console.log("moveRight");
    Grid.moveDirection(Grid.right);
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
      let targetCell = options[getRandom(0,options.length)];
      Grid.set(targetCell, Grid.nextNumber);
      Grid.nextNumber = getRandom(1,3);
      // console.log("Number Added to",targetCell);
    }
  }
};
var applicationState = {
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
