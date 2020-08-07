<template>
  <div class="cell" :style="CellContainerStyle">
    <div :style="cellStyle">
      {{ Value }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ICell } from "../../model/views";
import { IS_DARK, COLORS } from "../../model/constants";
import { ICellValue } from "../../model/interfaces";

@Component
export default class Cell extends Vue implements ICell {
  public grid: HTMLDivElement;
  @Prop({ type: Boolean, default: false }) dark: boolean;
  @Prop({ type: Boolean, default: true }) absolute: boolean;
  @Prop({ type: Number, default: 0 }) row;
  @Prop({ type: Number, default: 0 }) col;
  @Prop({ type: Number, default: 0 }) value;
  @Prop({ type: Number, default: 100 }) size: number;
  @Prop({ type: Number, default: 4 }) padding: number;
  get Height() {
    return this.size;
  }
  get Width() {
    return this.size * 0.8;
  }
  get LineHeight() {
    return `${this.Height - this.padding * 2}px`;
  }

  get Row(){
    return this.row;
  }
  get Col(){
    return this.col;
  }
  get CellContainerStyle(){
    return {
      position: this.absolute ? "absolute" : undefined,
      padding: `${this.padding}px`,
      width: `${this.Width}px`,
      height: `${this.Height}px`,
      top: `${this.Height * this.row}px`,
      left: `${this.Width * this.col}px`,
      "font-size": `${this.size * 0.18}px`
    };
  }
  get Value() {
    return this.value;
  }
  get CellValue(): ICellValue {
    return {
      c: this.col,
      r: this.row,
      value: this.value,
    };
  }
  setValue(v) {
    this.value = v;
  }
  isAt(coords) {
    return this.row == coords.r && this.col == coords.c;
  }
  coords(){
    return {
      r: this.row,
      c: this.col,
    };
  }
  moveUp(){
    let newRow = this.row - 1;
    if (newRow < 0) {
      return;
    }
    // console.log(`Cell ${this.value}: moveUp`);
    this.row = newRow;
  }
  moveDown(){
    let newRow = this.row + 1;
    if (newRow > 3) {
      return;
    }
    // console.log(`Cell ${this.value}: moveDown`);
    this.row = newRow;
  }
  moveLeft(){
    let newCol = this.col - 1;
    if (newCol < 0) {
      return;
    }
    // console.log(`Cell ${this.value}: moveLeft`);
    this.col = newCol;
  }
  moveRight(){
    let newCol = this.col + 1;
    if (newCol > 3) {
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
          'line-height': this.LineHeight
        };
      case 2:
        return {
          'color': COLORS['light'].FONT_COLOR_INVERT,
          'background-color': COLORS['light'].cell.two,
          'line-height': this.LineHeight
        }
      default:
        return {
          'color': COLORS[this.theme].FONT_COLOR,
          'background-color': COLORS[this.theme].cell.background,
          'box-shadow': this.BoxShadow,
          'line-height': this.LineHeight
        };
    }
  }
  get theme(){
    return this.dark ? 'dark' : 'light';
  }

  get BoxShadow(){
    if (this.value >= 192) return `4px 4px 4px 0px ${COLORS.SHADOW}`;
    if (this.value >= 48) return `2px 2px 4px 0px ${COLORS.SHADOW}`;
    if (this.value >= 12) return `1px 1px 2px 0px ${COLORS.SHADOW}`;
    else return `0px 0px 0px 0px ${COLORS.SHADOW}`;
  }

}
</script>

<style lang="scss">
@import "src/scss/colors";
div.cell{
  // border: 1px solid green;
  background-color: none;
  box-sizing: border-box;
  top: 0;
  left: 0;
  display: block;
  font-family: "lato";
  font-weight: bold;
  transition: all 0.1s ease-out;
  text-align: center;

  div{
    border-radius: 5px;
    color: black;
    &.blue{
      color: $background;
    }
    &.red{
      color: $background;
    }
  }
}
</style>
