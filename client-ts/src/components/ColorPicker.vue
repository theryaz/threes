<template>
  <component
    :is="RootComponent"
    v-model="showPickColor"
    :close-on-click="true"
    :close-on-content-click="false"
    >

    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="secondary">
        <v-icon v-bind:class="{'mr-2': !dense}">
          fa-palette
        </v-icon>
        <template v-if="!dense">
          Color
        </template>
      </v-btn>
    </template>

    <v-card max-width="350px" class="justify-center">
      <v-card-title class="justify-center">
        <v-color-picker
          v-model="selectedColor"
          :mode="'hexa'"
        />
      </v-card-title>

      <v-chip-group column>
        <v-chip v-for="c of ColorList" :key="c.label" outlined tile @click="selectedColor = c.color">
          <v-avatar class="mr-1" :color="c.color"/> {{ c.label }}
        </v-chip>
      </v-chip-group>

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
  </component>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import VMenu from 'vuetify/lib/components/VMenu';
import VDialog from 'vuetify/lib/components/VDialog';
import { IPlayer } from '../model/interfaces';
import { COLORS } from '../model/constants';

import { capitalize } from '../shared';

interface Color{
  color: string,
  label: string,
}

@Component
export default class ColorPicker extends Vue{
  @Prop({ default: false, type: Boolean }) dense: boolean;
  
  @Prop({ default: () => [] }) colors!: Color[];
  @Prop({ default: () => [] }) addColors!: Color[];

  @Prop({ default: "crimson" }) color!: string;

  private showPickColor: boolean = false;

  private selectedColor: string = this.color;

  get ColorList(){
    if(this.colors.length > 0){
      return this.colors;
    }
    return [...this.getColors(), ...this.addColors];
  }

  get IsMobile(): boolean {
    return this.$vuetify.breakpoint.mobile;
  }

  get RootComponent(){
    if (this.IsMobile) {
      return VDialog;
    }
    return VMenu;
  }

  getColors(){
    const colors: Color[] = [];
    const colorKeys = Object.keys(COLORS);
    colorKeys.forEach((colorKey) => {
      if(typeof COLORS[colorKey] === 'string'){
        colors.push({
          color: COLORS[colorKey],
          label: capitalize(colorKey),
        });
      }
    });
    return colors;
  }

  onSave(){
    this.$emit('save', this.selectedColor);
    this.showPickColor = false;
  }
  onCancel(){
    this.showPickColor = false;
    this.$emit('close');
  }
}
</script>