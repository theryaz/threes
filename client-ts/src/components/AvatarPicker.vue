<template>
  <v-dialog
    v-model="showPickAvatar"
    :close-on-click="true"
    :close-on-content-click="false"
  >

    <template v-slot:activator="{ on }">
      <slot name="activator" :on="on">
        <v-btn v-on="on" color="primary">
          <v-icon v-bind:class="{ 'mr-2': !dense }">
            fa-user
          </v-icon>
          <template v-if="!dense">
            Image
          </template>
        </v-btn>
      </slot>
    </template>

    <v-card width="100%" class="text-center">
      <v-card-text>
        <v-avatar
          v-for="(avatar, index) of AvatarList"
          :key="index"
          @click="() => onSave(avatar)"
          class="ma-1"
          :color="backgroundColor"
        >
          <v-icon :color="iconColor">
            {{ avatar }}
          </v-icon>
        </v-avatar>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IPlayer } from "../model/interfaces";
import { AVATARS } from "../model/constants";

import { capitalize } from "../shared";

@Component
export default class AvatarPicker extends Vue {
  @Prop({ default: false, type: Boolean }) dense: boolean;

  @Prop({ default: () => [] }) avatars: string[];
  @Prop({ default: () => [] }) addAvatars: string[];

  @Prop({ default: "white" }) iconColor: string;
  @Prop({ default: "primary" }) backgroundColor: string;

  @Prop({ default: "fa-user" }) avatar: string;
  updateAvatar(value: string){
    this.$emit("update:avatar", value);
  }

  private showPickAvatar = false;

  get IsMobile(): boolean {
    return this.$vuetify.breakpoint.mobile;
  }

  get AvatarList(){
    if (this.avatars.length > 0) {
      return this.avatars;
    }
    return [...AVATARS, ...this.addAvatars];
  }

  onSave(a: string){
    this.updateAvatar(a);
    this.showPickAvatar = false;
  }
  onCancel(){
    this.showPickAvatar = false;
    this.$emit("close");
  }
}
</script>