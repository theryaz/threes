<template>
  <div
    v-on:click="logState()"
    class="cell"
    v-bind:class="[
    this.state.grid.getClass(this.value),
    getRow(),
    getCol(),
    ]">
    {{ value }}
  </div>
</template>

<script>

export default {
  name: 'Cell',
  props:{
    row: 0,
    col: 0,
    value: 0,
  },
  mounted(){
    console.log("Cell Created", this.row, this.col, this.value);
  },
  data() {
    return {
    };
  },
  methods: {
    getRow(){
      switch (this.row) {
        case 0: return 'r0';
        case 1: return 'r1';
        case 2: return 'r2';
        case 3: return 'r3';
      }
    },
    getCol(){
      switch (this.col) {
        case 0: return 'c0';
        case 1: return 'c1';
        case 2: return 'c2';
        case 3: return 'c3';
      }
    },
    setValue(v){ this.value = v; },
    moveUp(){
      let newRow = this.row - 1;
      if(newRow < 0) return;
      console.log("Cell: moveUp");
      let thisCell = this.state.grid[this.row][this.col];
      this.state.grid[newRow][this.col] = thisCell;
      this.row = newRow;
    },
    moveDown(){
      let newRow = this.row + 1;
      if(newRow > 3) return;
      console.log("Cell: moveDown");
      let thisCell = this.state.grid[this.row][this.col];
      this.state.grid[newRow][this.col] = thisCell;
      this.row = newRow;
    },
    moveLeft(){
      let newCol = this.col - 1;
      if(newCol < 0) return;
      console.log("Cell: moveLeft");
      let thisCell = this.state.grid[this.row][this.col];
      this.state.grid[this.row][newCol] = thisCell;
      this.col = newCol;
    },
    moveRight(){
      let newCol = this.col + 1;
      if(newCol > 3) return;
      console.log("Cell: moveRight");
      let thisCell = this.state.grid[this.row][this.col];
      this.state.grid[this.row][newCol] = thisCell;
      this.col = newCol;
    },
    logState(){
      console.log("Cell State:",this.row, this.col, this.value);
    },
    destroy(){
      console.log("Destroying Cell", this.row, this.col);
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
</script>

<style lang="scss">
  @import "../scss/cell";
  div.cell{
    // transform: scale(0.9) translateX(30px);
  }
</style>
