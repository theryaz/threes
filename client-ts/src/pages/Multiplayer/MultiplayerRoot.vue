<template>
  <v-container id="MultiplayerRoot">
    <router-view></router-view>
  </v-container>
</template>
<script lang="ts">
import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import { Component, Vue } from 'vue-property-decorator';

import UserModule from '../../store/user/user.store';
const userStore = getModule(UserModule);
import GameModule from '../../store/game/game.store';
import * as GameMutationTypes from '../../store/game/game.types';
import apiService from '../../services/api.service';
import { IGameMove, IGameGridState } from '../../model/interfaces';
const gameStore = getModule(GameModule);

@Component({
  computed:{
    ...mapState(['userStore']),
    ...mapState(['gameStore']),
  }
})
export default class MultiplayerRoot extends Vue{
  
}
</script>
<style lang="scss">
</style>
