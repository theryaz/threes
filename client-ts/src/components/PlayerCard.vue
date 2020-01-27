<template>
  <v-row>
    <v-col>
      <v-avatar :color="color">
        <img v-if="avatarUrl !== null" src="avatarUrl">
        <v-icon v-else color="#FEFEFE">{{ avatarIcon }}</v-icon>
      </v-avatar>
      <span>
        {{ username }}
      </span>
    </v-col>
    <v-col v-if="player" class="text-right">
      <span v-if="player.isInGame">
        In Game
      </span>
      <span v-else>
        In Lobby
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
}
</script>