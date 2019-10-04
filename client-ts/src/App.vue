<template>
  <v-app>
    <v-navigation-drawer
      v-model="showNav"
      absolute
    >
      <v-list-item>
        Threes
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class App extends Vue{
  showNav: boolean = true;
  items = [
    { title: 'Home', icon: 'fa fa-home'}
  ];
}
</script>