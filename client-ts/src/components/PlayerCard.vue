<template>
  <div>
    <v-avatar :color="color">
      <img v-if="avatarUrl !== null" src="avatarUrl">
      <v-icon v-else color="#FEFEFE">{{ avatarIcon }}</v-icon>
    </v-avatar>
    <span>
      {{ username }}
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export default class PlayerCard extends Vue{
  @Prop({default: "crimson"}) color: string;
  @Prop({default: null}) avatarUrl: string;
  @Prop({default: "fa-user-astronaut"}) avatarIcon: string;
  @Prop({default: "Player"}) username: string;
}
</script>