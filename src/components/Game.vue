<template>
  <div>
    <h1>Next Number: {{this.state.grid.nextNumber}}</h1>
    <div id="playing-grid">
      <div v-for="row in rows" :key="row" class="row">
        <my-cell v-for="col in columns" :key="col" :row="row" :col="col"/>
      </div>
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
    // Init Grid with 9 numbers
    let initial_nums = [];
    for(let init = 0; init < 9; init++){
      initial_nums.push({
        coordinates: [this.getRandom(0,3),this.getRandom(0,3)],
        value: this.getRandom(1,3)
      });
    }

    // Test Grid
    // initial_nums = [
    //   {coordinates: [0,0], value: 2},
    //   {coordinates: [1,0], value: 2},
    //   {coordinates: [0,1], value: 1},
    //   {coordinates: [1,1], value: 1},
    // ];

    for(let i of initial_nums){
      this.state.grid[i.coordinates[0]][i.coordinates[1]] = i.value;
    }

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
  data() {
    return {
    }
  },
  methods:{
    getRandom(min,max){
      return Math.floor(Math.random() * max) + min;
    }
  }
}
</script>

<style lang="scss">
  $size: 75px;
  #playing-grid{
    background: #EFEFEF;
    max-width: ($size * 4);
    margin: auto;
    padding: 15px 0px;
    border-radius: 5px;
  }

</style>
