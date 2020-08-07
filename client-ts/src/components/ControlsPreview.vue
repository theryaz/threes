<template>
  <span>
    <table>
      <tr>
        <td class="text-center" colspan="3">
          <v-icon :color="UpPressed ? 'primary' : ''">{{ icons.moveUp }}</v-icon>
        </td>
      </tr>
      <tr>
        <td>
          <v-icon :color="LeftPressed ? 'primary' : ''">{{ icons.moveLeft }}</v-icon>
        </td>
        <td>
          <v-icon :color="DownPressed ? 'primary' : ''" class="mx-1">{{ icons.moveDown }}</v-icon>
        </td>
        <td>
          <v-icon :color="RightPressed ? 'primary' : ''">{{ icons.moveRight }}</v-icon>
        </td>
      </tr>
    </table>
  </span>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ControlsPreview extends Vue{
  private keydownListenerFn: (this: Window, ev: KeyboardEvent) => any;
  private keyupListenerFn: (this: Window, ev: KeyboardEvent) => any;
  
  private keys = {
    moveUp: 38,
    moveLeft: 37,
    moveDown: 40,
    moveRight: 39,
  };
  private icons = {
    moveUp: "fal fa-arrow-alt-square-up",
    moveLeft: "fal fa-arrow-alt-square-left",
    moveDown: "fal fa-arrow-alt-square-down",
    moveRight: "fal fa-arrow-alt-square-right",
  };

  private UpPressed: boolean = false;
  private LeftPressed: boolean = false;
  private DownPressed: boolean = false;
  private RightPressed: boolean = false;

  mounted(){  
    this.setupKeyListeners();
  }
  beforeDestroy(){
    this.teardownKeyListeners();
  }

  setupKeyListeners(){
    this.keydownListenerFn = (e: any) => {
      e = e || window.event;
      if (e.keyCode == this.keys.moveUp) {
        this.UpPressed = true;
      }
      else if (e.keyCode == this.keys.moveDown) {
        this.DownPressed = true;
      }
      else if (e.keyCode == this.keys.moveLeft) {
        this.LeftPressed = true;
      }
      else if (e.keyCode == this.keys.moveRight) {
        this.RightPressed = true;
      }
    };
    window.addEventListener('keydown', this.keydownListenerFn);

    this.keyupListenerFn = (e: any) => {
      e = e || window.event;
      if (e.keyCode == this.keys.moveUp) {
        this.UpPressed = false;
      }
      else if (e.keyCode == this.keys.moveDown) {
        this.DownPressed = false;
      }
      else if (e.keyCode == this.keys.moveLeft) {
        this.LeftPressed = false;
      }
      else if (e.keyCode == this.keys.moveRight) {
        this.RightPressed = false;
      }
    };
    window.addEventListener('keyup', this.keyupListenerFn);
  }
  teardownKeyListeners(){

  }
}
</script>
<style lang="scss" scoped>
table{
  display: inline;
  border-collapse: collapse;
  padding: 0;
}
</style>