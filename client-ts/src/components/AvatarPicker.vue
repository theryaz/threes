<template>
  <v-dialog v-on:click:outside="onClose" :persistent="persistent" :value="show" max-width="400">
    
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IPlayer } from '../model/interfaces';
@Component
export default class ColorPicker extends Vue{
  @Prop({ default: "crimson" }) color: string;
}
</script>