<template>
  <div class="cell" v-bind:class="[
    getRow(),
    getCol()
  ]">
    <div
    v-bind:class="[this.grid.getClass(this.value)]">
    {{ value }}
  </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Grid } from './model/Grid';
import { ICell } from '../../model/views';

@Component
export default class Cell extends Vue implements ICell{
  @Prop() row = 0;
  @Prop() col = 0;
  @Prop() value = 0;
  @Prop(Grid) grid: Grid;
  created(){
    console.log("[Cell.vue] created", this.row, this.col, this.value, this.grid);
  };
  mounted(){
    console.log("[Cell.vue] mounted", this.row, this.col, this.value, this.grid);
  };
  getRow(){
    switch (this.row) {
      case 0: return 'r0';
      case 1: return 'r1';
      case 2: return 'r2';
      case 3: return 'r3';
    }
  }
  getCol(){
    switch (this.col) {
      case 0: return 'c0';
      case 1: return 'c1';
      case 2: return 'c2';
      case 3: return 'c3';
    }
  }
  setValue(v){ this.value = v; }
  isAt(coords){
    return (this.row == coords.r && this.col == coords.c);
  }
  coords(){
    return{
      r: this.row,
      c: this.col,
    };
  }
  moveUp(){
    let newRow = this.row - 1;
    if(newRow < 0) {
      return;
    }
    console.log(`Cell ${this.value}: moveUp`);
    this.row = newRow;
  }
  moveDown(){
    let newRow = this.row + 1;
    if(newRow > 3) {
      return;
    }
    console.log(`Cell ${this.value}: moveDown`);
    this.row = newRow;
  }
  moveLeft(){
    let newCol = this.col - 1;
    if(newCol < 0) {
      return;
    }
    console.log(`Cell ${this.value}: moveLeft`);
    this.col = newCol;
  }
  moveRight(){
    let newCol = this.col + 1;
    if(newCol > 3) {
      return;
    }
    console.log(`Cell ${this.value}: moveRight`);
    this.col = newCol;
  }
  destroy(){
    console.log("Destroying Cell", this.row, this.col);
    this.$el.parentNode.removeChild(this.$el);
    // this.$destroy();
  }
}
</script>

<style lang="scss">
  @import "src/scss/cell";
</style>
