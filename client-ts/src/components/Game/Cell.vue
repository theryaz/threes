<template>
  <div class="cell" :class="[
    getRow(),
    getCol()
  ]">
    <div
    :style="cellStyle">
    {{ Value }}
  </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ICell } from '../../model/views';
import { IS_DARK, COLORS } from "../../model/constants";

@Component
export default class Cell extends Vue implements ICell{
  @Prop({ type: Number, default: 0 }) row;
  @Prop({ type: Number, default: 0 }) col;
  @Prop({ type: Number, default: 0 }) value;
  created(){
    // console.log("[Cell.vue] created", this.row, this.col, this.value, this.grid);
  };
  mounted(){
    // console.log("[Cell.vue] mounted", this.row, this.col, this.value, this.grid);
  };

  get Row(){
    return this.row;
  }
  get Col(){
    return this.col;
  }
  get Value(){
    return this.value;
  }
  getRow(){
    switch (this.Row) {
      case 0: return 'r0';
      case 1: return 'r1';
      case 2: return 'r2';
      case 3: return 'r3';
    }
  }
  getCol(){
    switch (this.Col) {
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
    // console.log(`Cell ${this.value}: moveUp`);
    this.row = newRow;
  }
  moveDown(){
    let newRow = this.row + 1;
    if(newRow > 3) {
      return;
    }
    // console.log(`Cell ${this.value}: moveDown`);
    this.row = newRow;
  }
  moveLeft(){
    let newCol = this.col - 1;
    if(newCol < 0) {
      return;
    }
    // console.log(`Cell ${this.value}: moveLeft`);
    this.col = newCol;
  }
  moveRight(){
    let newCol = this.col + 1;
    if(newCol > 3) {
      return;
    }
    // console.log(`Cell ${this.value}: moveRight`);
    this.col = newCol;
  }
  destroy(){
    // console.log("Destroying Cell", this.row, this.col);
    this.$el.parentNode.removeChild(this.$el);
    // this.$destroy();
  }
  get cellStyle(){
    switch(this.Value){
      case 1:
        return{
          'color': COLORS['light'].FONT_COLOR_INVERT,
          'background-color': COLORS['light'].cell.one,
        };
      case 2:
        return {
          'color': COLORS['light'].FONT_COLOR_INVERT,
          'background-color': COLORS['light'].cell.two,
        }
      default:
        return {
          'color': COLORS[this.theme].FONT_COLOR,
          'background-color': COLORS[this.theme].cell.background,
        };
    }
  }
  get theme(){
    return IS_DARK ? 'dark' : 'light';
  }
}
</script>

<style lang="scss">
  @import "src/scss/cell";
</style>
