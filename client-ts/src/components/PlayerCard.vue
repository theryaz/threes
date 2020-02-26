<template>
  <v-row dense>
    <v-col dense>
      <v-avatar :color="color">
        <img v-if="avatarUrl !== null" src="avatarUrl">
        <v-icon v-else color="#FEFEFE">{{ avatarIcon }}</v-icon>
      </v-avatar>
      <span>
        {{ username }}
      </span>
    </v-col>
    <v-col v-if="player" class="d-flex align-content-center flex-wrap justify-end pr-2">
      <v-btn v-on:click="onJoinGame" v-if="player.isInGame" color="blue" dark>
        Join Game
      </v-btn>
      <span v-else class="caption">
        Waiting for Game
      </span>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IPlayer } from '../model/interfaces';

@Component
export default class PlayerCard extends Vue{
  @Prop({default: "crimson"}) color: string;
  @Prop({default: null}) avatarUrl: string;
  @Prop({default: "fa-user"}) avatarIcon: string;
  @Prop({default: "Player"}) username: string;
  @Prop() player: IPlayer;

  onJoinGame(){
    this.$emit('onJoinGame');
  }
}
</script>