<template>
  <v-bottom-navigation
    absolute
    grow
    horizontal
    color="primary"
  >
    <v-btn to="/" value="play" height="100%">
      <span>Play</span>
      <v-icon>fa-gamepad</v-icon>
    </v-btn>
    
    <v-btn to="/multiplayer" value="online" height="100%">
      <span>Multiplayer</span>
      <v-icon>fa-user-friends</v-icon>
    </v-btn>

    <v-btn to="/settings" value="settings" height="100%">
      <span>Settings</span>
      <v-icon>fa-cog</v-icon>
    </v-btn>

  </v-bottom-navigation>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class NavBar extends Vue{
}
</script>