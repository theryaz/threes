<template>
  <div>
    <div id="main-loader" class="loader larger" v-if="state.isLoading">
      <i class="fas fa-spinner-third common-spinner"></i>
      <h4>Loading...</h4>
    </div>
    <template v-else>
      <div id="game-heading">
        <h3>MultiplayerGame ID: {{state.gameOptions.id}}</h3>
      </div>
      <div v-if="state.gameOptions.id == null">
        <div id="controls">
          <div class="button">
            <button v-on:click="hostGame" class="common red-primary">
              Host Game
            </button>
          </div>
          <div class="button">
            <div>
              <input type="text" id="id-input" class="common" placeholder="Game ID" v-model="joinGameId"/>
            </div>
            <button v-on:click="joinGame" class="common blue-primary">
              Join Game
            </button>
          </div>
        </div>
      </div>
      <template v-else>
        <div v-if="state.isConnected == false">
          <h5>Waiting for Player to Join...</h5>
          <button v-on:click="cancelHost" class="common red-primary">Cancel</button>
        </div>
        <template v-else>
          <div id="game-grid">
            <div id="game-a">
              <Game :options="optionsGameA"></Game>
            </div>
            <div id="game-b">
              <Game :options="optionsGameB"></Game>
            </div>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import socketClient from '../socketClient';
import { mapState } from 'vuex';
import * as MultiplayerGameMutationTypes from '../store/multiplayer-game/multiplayer-game.mutation-types';

export default {
  name: 'MultiplayerGame',
  mounted(){
    socketClient.on('hostGame', this.hostGameAck);
    socketClient.on('joinGame', this.joinGameAck);
    socketClient.on('playerJoined', this.playerJoined);
  },
  data:() => {
    return{
      joinGameId: null,
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
  },
  methods:{
    cancelHost(){
      this.$store.commit(MultiplayerGameMutationTypes.CANCEL_HOST_GAME);
    },
    hostGame(){
      this.$store.dispatch(MultiplayerGameMutationTypes.HOST_GAME);
    },
    hostGameAck(payload){
      console.log("payload", payload);
      this.$store.commit(MultiplayerGameMutationTypes.HOST_GAME_SUCCESS, {id: payload.gameId})
    },
    joinGame(){
      console.log("joinGame", this.joinGameId);
      this.$store.dispatch(MultiplayerGameMutationTypes.JOIN_GAME, {id: this.joinGameId});
    },
    joinGameAck(payload){
      this.$store.commit(MultiplayerGameMutationTypes.JOIN_GAME_SUCCESS, {gameId: payload.gameId, remotePlayerId: payload.remotePlayerId});
    },
    playerJoined(payload){
      console.log("playerJoined", payload);
      this.$store.commit(MultiplayerGameMutationTypes.PLAYER_JOINED, payload);
    },
  },
  sockets:{
    connect(){
      console.log("Socket Connected!");
    },
  }
}
</script>

<style lang="scss" scoped>

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

#controls{
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 1 2;

  #id-input-wrapper{
    grid-row-start: 1;
    grid-row-end: 1;
    grid-column-start: 2;
    grid-column-end: 2;
    input{
      font-size: 1.2rem;
      padding: 10px;
    }
  }
  div.button{
    grid-row-start: 2;
    grid-row-end: 2;
  }
}


</style>
