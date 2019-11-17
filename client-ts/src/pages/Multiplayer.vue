<template>
  <v-container id="multiplayer">
    <v-row>
      <v-col cols="6">
        <Game>
          <PlayerCard :username="'TheRyaz'" />
        </Game>
      </v-col>
      <v-col cols="6">
        <Game :isRemote="true">
          <PlayerCard :username="'Wolf'" color="pink" avatarIcon="fa-dog"/>
        </Game>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlayerCard from '../components/PlayerCard.vue';

@Component({
  components: { PlayerCard }
})
export default class Multiplayer extends Vue{

}
</script>
<style lang="scss">
</style>
