<template>
  <div>
    <div id="main-loader" class="loader larger" v-if="state.isLoading">
      <i class="fas fa-spinner-third common-spinner"></i>
      <h4>Loading...</h4>
    </div>
    <template v-else>
      <div id="game-heading">
        <h3>MultiplayerGame ID: {{state.gameOptions.uuid}}</h3>
      </div>
      <div id="game-grid">
        <div id="game-a">
          <Game :options="optionsGameA"></Game>
        </div>
        <div id="game-b">
          <Game :options="optionsGameB"></Game>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as MultiplayerGameMutationTypes from '../store/multiplayer-game/multiplayer-game.mutation-types';

export default {
  name: 'MultiplayerGame',
  mounted(){
    console.log("MultiplayerGame Dispatch HOST_GAME", MultiplayerGameMutationTypes.HOST_GAME);
    this.$store.dispatch(MultiplayerGameMutationTypes.HOST_GAME);
  },
  data:() => {
    return{
      optionsGameA: {
        isMultiplayer: true,
        isRemote: false,
        remoteId: null
      },
      optionsGameB: {
        isMultiplayer: true,
        isRemote: true,
        remoteId: null
      },
    }
  },
  computed:{
    state(){
      return this.$store.state.multiplayerGameState;
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

#main-loader{
  padding: 4rem;
}

</style>
