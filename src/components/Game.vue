<template>
  <div>
    <h1 id="title">
      Next Number:
      <div id="preview" class="cell" :class="this.state.grid.getClass(this.state.grid.nextNumber)">
        {{this.state.grid.nextNumber}}
      </div>
    </h1>
    <div id="playing-grid" ref="grid">
    </div>
  </div>
</template>

<script>

export default {
  name: 'Game',
  props: {
    columns: Number,
    rows: Number,
  },
  beforeMount(){
    window.addEventListener('keydown', (e) => {
        e = e || window.event;
        if (e.keyCode == '38') {
          this.state.grid.moveUp();
        }
        else if (e.keyCode == '40') {
          this.state.grid.moveDown();
        }
        else if (e.keyCode == '37') {
          this.state.grid.moveLeft();
        }
        else if (e.keyCode == '39') {
          this.state.grid.moveRight();
        }
    });

  },
  mounted(){
    console.log("Refs", this.$refs);
    this.initializeGame();
  },
  data() {
    return {}
  },
  methods:{
    getRandom(min,max){
      return Math.floor(Math.random() * max) + min;
    },
    initializeGame(){
      this.state.grid.initializeGame(this.$refs.grid, 9);
    }
  }
}
</script>

<style lang="scss">
  @import "../scss/cell";
  #title{
    font-size: 1.5rem;
    #preview{
      display: inline-block;
      position: static;
      transform: scale(0.7);
      border: 1px solid #EFEFEF;
    }
  }
  #playing-grid{
    position: relative;
    background: #EFEFEF;
    width: ($size * 4);
    height: ($size * 4) + 5px;
    margin: auto;
    border-radius: 5px;
  }

</style>
