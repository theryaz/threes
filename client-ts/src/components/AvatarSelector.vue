<template>
  <v-card class="pa-2" outlined>
    <v-layout>
      <v-avatar :color="selectedAvatarColor">
        <img v-if="avatarUrl !== null" src="avatarUrl">
        <v-icon v-else color="#FEFEFE">{{ selectedAvatarIcon }}</v-icon>
      </v-avatar>
      <v-spacer />
      <v-card-actions class="text-center">
        
        <v-btn color="primary">
          <v-icon v-bind:class="{'mr-2': !dense}">
            fa-user
          </v-icon>
          <template v-if="!dense">
            Image
          </template>
        </v-btn>

        <ColorPicker v-on:save="onSelectColor" :dense="dense" />
      </v-card-actions>
    </v-layout>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IPlayer } from '../model/interfaces';
import ColorPicker from './ColorPicker.vue';
import AvatarPicker from './AvatarPicker.vue';
@Component({
  components: { AvatarPicker, ColorPicker },
})
export default class AvatarSelector extends Vue{
  @Prop({ default:false, type: Boolean }) dense: boolean;

  @Prop({ default: "crimson" }) color: string;
  @Prop({ default: "fa-user" }) avatarIcon: string;
  @Prop({ default: null }) avatarUrl: string;

  private selectedAvatarColor = this.color;
  private selectedAvatarIcon = this.avatarIcon;

  onSelectColor(selectedColor: string){
    console.log("onSelectColor", selectedColor);
    this.selectedAvatarColor = selectedColor;
    this.onChange();
  }
  onSelectAvatarIcon(selectedAvatarIcon: string){
    this.selectedAvatarIcon = selectedAvatarIcon;
    this.onChange();
  }

  onChange(){
    this.$emit('change', { 
      color: this.selectedAvatarColor,
      avatarIcon: this.selectedAvatarIcon,
    });
  }
  

}
</script>