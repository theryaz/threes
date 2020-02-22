<template>
  <v-menu
    v-model="showPickAvatar"
    :close-on-click="true"
    :close-on-content-click="false"
    >

    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="primary">
        <v-icon v-bind:class="{'mr-2': !dense}">
          fa-user
        </v-icon>
        <template v-if="!dense">
          Image
        </template>
      </v-btn>
    </template>

    <v-card max-width="350px" class="justify-center">
      <!-- <v-card-title class="justify-center">
        <v-color-picker
          v-model="selectedAvatar"
          hide-canvas
          hide-mode-switch
          :mode="'hexa'"
        />
      </v-card-title> -->

      <v-item-group mandatory>
        <v-btn
          v-for="(a,index) of AvatarList"
          :key="index"
          @click="selectedAvatar = a.icon"
          text icon outlined
          class="ma-1"
          :value="a.icon"
        >
          <v-icon>
            {{ a.icon }}
          </v-icon>
        </v-btn>
      </v-item-group>

      <v-card-actions>
        <v-btn color="crimson" outlined @click="onCancel">
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn color="primary" @click="onSave">
          Save
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-menu>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IPlayer } from '../model/interfaces';
import { AVATARS } from '../model/constants';

import { capitalize } from '../shared';

interface IAvatarIcon{
  icon: string,
}

@Component
export default class AvatarPicker extends Vue{
  @Prop({ default: false, type: Boolean }) dense: boolean;

  @Prop({ default: () => [] }) avatars: IAvatarIcon[];
  @Prop({ default: () => [] }) addAvatars: IAvatarIcon[];

  @Prop({ default: "fa-user" }) avatar: IAvatarIcon;

  private showPickAvatar: boolean = false;

  private selectedAvatar: IAvatarIcon = this.avatar;

  get AvatarList(){
    if(this.avatars.length > 0){
      return this.avatars;
    }
    return [...AVATARS, ...this.addAvatars];
  }

  onSave(){
    this.$emit('save', this.selectedAvatar);
    this.showPickAvatar = false;
  }
  onCancel(){
    this.showPickAvatar = false;
    this.$emit('close');
  }
}
</script>