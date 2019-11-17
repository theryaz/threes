<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
    <NavBar />
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavBar from './components/NavBar.vue';
@Component({
  components: { NavBar }
})
export default class App extends Vue{
  showNav: boolean = true;
  items = [
    { title: 'Home', icon: 'fa fa-home'}
  ];
}
</script>