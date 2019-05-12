<template>
  <div>
    <div id="game-heading">
      <h3>MultiplayerGame</h3>
    </div>
    <div id="game-grid">
      <div id="game-a">
        <Game></Game>
      </div>
      <div id="game-b">
        <Game></Game>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultiplayerGame',
  data:() => {
    return{
    }
  }
}
</script>

<style scoped>

#game-grid{
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;

  #game-a{
    grid-column-start: 1;
    grid-column-end: 1;
  }
  #game-b{
    grid-column-start: 2;
    grid-column-end: 2;

  }
}

</style>
