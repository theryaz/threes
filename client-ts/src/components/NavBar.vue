<template>
  <v-bottom-navigation app grow horizontal color="primary">
    <v-btn to="/" value="play" height="100%">
      <span>Play</span>
      <v-icon>fal fa-gamepad</v-icon>
    </v-btn>

    <v-btn v-if="ShowLocal" to="/local-multiplayer" value="local" height="100%">
      <span>Local</span>
      <v-icon>fal fa-user-friends</v-icon>
    </v-btn>

    <v-btn to="/multiplayer" value="online" height="100%">
      <span>Online</span>
      <v-icon>fal fa-users</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { mapState } from "vuex";
import { getModule } from "vuex-module-decorators";

import * as UserMutationTypes from "../store/user/user.types";
import UserModule from "../store/user/user.store";
const userStore = getModule(UserModule);

import PlayerCard from "../components/PlayerCard.vue";
import RegisterDialog from "../components/RegisterDialog.vue";
import apiService from "../services/api.service";

@Component({
  components: { PlayerCard, RegisterDialog },
  computed: {
    ...mapState(["userStore"]),
  }
})
export default class NavBar extends Vue {
  get ShowLocal() {
    return this.$vuetify.breakpoint.mdAndUp;
  }
  logout(){
    userStore.logout().then(() => {
      this.$router.push("/");
    });
  }
}
</script>
