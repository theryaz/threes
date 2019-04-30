<template>
  <div
    class="cell"
    :style="styleObject"
    :class="getClass()">
    {{ this.Value() }}
  </div>
</template>

<script>

export default {
  name: 'Cell',
  props:{
    row: Number,
    col: Number,
    initialValue: Number,
  },
  mounted(){
    if(this.initialValue){
      this.setValue(this.initialValue);
    }
  },
  data() {
    return {
      Value: () => this.state.grid[this.row - 1][this.col - 1],
      setValue: (v) => this.state.grid[this.row - 1][this.col - 1] = v,
      getClass(){
        let value = this.state.grid[this.row - 1][this.col - 1];
        return this.state.grid.getClass(value);
      },
      styleObject:{
        top: this.getTop() + "px",
        left: this.getLeft() + "px",
      }
    };
  },
  methods: {
    getTop(){
      return (this.row -1) * 75;
    },
    getLeft(){
      return (this.col - 1) * (75 * 0.8);
    }
  }
}
</script>

<style lang="scss">
  @import "../scss/cell";
  div.cell{
    transform: scale(0.9) translateX(30px);
  }
</style>
