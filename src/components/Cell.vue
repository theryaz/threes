<template>
  <div class="cell" v-bind:class="getClass()">
    {{ this.Value() }}
  </div>
</template>

<script>

export default {
  name: 'Cell',
  props:{
    row: Number,
    col: Number
  },
  data() {
    return {
      Value: () => this.state.grid[this.row - 1][this.col - 1],
      setValue: (v) => this.state.grid[this.row - 1][this.col - 1] = v,
      getClass(){
        let value = this.state.grid[this.row - 1][this.col - 1];
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
  }
}
</script>

<style lang="scss">
  $size: 75px;
  div.cell{
    font-family: "lato";
    background-color: white;
    display: inline-block;
    margin: 2px 3px;
    width: $size * 0.8;
    height: $size;
    line-height: $size;
    border-radius: 2px;
    font-weight: bold;
    font-size: 1.2rem;

    &.blue{
      color: white;
      background-color: #66CCFF;
    }
    &.red{
      color: white;
      background-color: #FF6680;
    }
    &.white{
      color: black;
      background-color: #FFFFFF;
    }
    &.empty{
      color: #DDD;
      background-color: #DDD;
    }
  }

</style>
