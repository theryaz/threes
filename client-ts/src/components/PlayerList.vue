<template>
  <v-container class="PlayerList">
    Players Online ({{playerList.length}})
    <v-card
      v-for="player in PlayerList"
      :key="player.socket"
      class="mt-2 pl-2 pr-2"
    >
      <PlayerCard
        :color="player.user.color"
        :player="player"
        :username="player.username"
        :avatarUrl="player.user.avatarUrl"
        :avatarIcon="player.user.avatarIcon"
        v-on:onJoinGame="() => joinGame(player)"
      />
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import { Component, Prop,  Vue } from 'vue-property-decorator';

import PlayerCard from './PlayerCard.vue';
import { IPlayer } from '../model/interfaces';

import GameModule from '../store/game/game.store';
import * as GameMutationTypes from '../store/game/game.types';
const gameStore = getModule(GameModule);

@Component({
  components: { PlayerCard },
})
export default class PlayerList extends Vue{
  @Prop({default: null}) limit: number | null;
  @Prop({default: () => []}) playerList: IPlayer[];

  get PlayerList(){
    if(this.limit === null){
      return this.playerList;
    }
    return this.playerList.slice(0, this.limit);
  }

  joinGame(player: IPlayer){
    if(player.gameShortId){
      gameStore.joinGame(player.gameShortId).then((success) => {
        if(success){
          // console.log("Joined Game!");
          this.$router.push('/multiplayer/game');
        }
      });
    }
  }
}
</script>
<style lang="scss">
</style>
