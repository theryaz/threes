<template>
  <div>
    <div id="main-loader" class="loader larger" v-if="state.isLoading">
      <i class="fas fa-spinner-third common-spinner"></i>
      <h4>Loading...</h4>
    </div>
    <template v-else>
      <table id="game-list" class="common">
        <tr>
          <th>
            Game Id
          </th>
          <th>
            Players
          </th>
        </tr>
        <tr v-for="game of state.gameList" v-on:click="joinGame(game.id)">
          <td class="left">
            {{game.name}}
          </td>
          <td class="center">
            <template v-if="game.guestId == null">
              1/2
            </template>
            <template v-else>
              2/2
            </template>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import socketClient from '../socketClient';
import * as MultiplayerGameMutationTypes from '../store/multiplayer-game/multiplayer-game.mutation-types';
import * as GameListMutationTypes from '../store/game-list/game-list.mutation-types';

export default {
  name: 'GameList',
  mounted(){
    socketClient.on('gameListUpdate', (payload) => {
      console.log("Got Game List", payload);
      this.$store.commit(GameListMutationTypes.GAME_LIST_UPDATE, payload);
    });
  },
  data:() => {
    return{

    };
  },
  computed:{
    state(){
      return this.$store.state.gameListState;
    }
  },
  methods:{
    joinGame(gameId){
      console.log("Join Game", gameId);
      this.$store.dispatch(MultiplayerGameMutationTypes.JOIN_GAME, gameId);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/colors";
  table#game-list{
    min-width: 80%;
    td{
      padding: 5px;
      font-family: monospace;
    }
    font-size: 0.8rem;
    tr{
      transition: background-color 0.1s ease;
      &:hover{
        background-color: $primary-color;
      }
      border-bottom: none;
      border-radius: 5px;
    }
    tr:first-child{
      &:hover{
        background-color: $background;
      }
    }
    tr:nth-child(even){
      background-color: darken($background, 10%);
    }
  }
</style>
