<template>
  <v-slide-y-transition>
    <v-btn v-show="show" @click="() => this.clickAction()" class="mt-4" :color="Color" :dark="!isWinner">
      <v-icon class="mr-2">fad fa-chevron-circle-left</v-icon> {{ Message }}
    </v-btn>
  </v-slide-y-transition>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

interface RandomTextOption{
  text: string,
  weight: number,
}
const winningTexts: RandomTextOption[] = [
  { text:"You won. Amazing!", weight: 1 },
  { text:"You won. Congrats!", weight: 1 },
  { text:"You won. Wicked!", weight: 1 },
  { text:"You won. Awesome!", weight: 1 },
  { text:"You won. Cool!", weight: 1 },
  { text:"You won. Impressive!", weight: 1 },
];

const losingTexts: RandomTextOption[] = [
  { text: "You won a chance to win next time.", weight: 0.1 },
  { text: "You lost. You'll get there.", weight: 0.25 },
  { text: "You lost. Ouch.", weight: 0.5 },
  { text: "You lost. You Tried.", weight: 0.5 },
  { text: "You lost. Oof.", weight: 1 },
  { text: "You lost. Devastating.", weight: 1 },
  { text: "You lost. Bummer.", weight: 1 },
];

@Component
export default class BackToLobby extends Vue{
  @Prop({ type: Boolean, default: false }) private show: boolean;
  @Prop({ type: Boolean }) private isWinner: boolean;
  @Prop({ type: String }) private textOverride: string;
  @Prop({ type:Function, default: function() { this.$router.push('/multiplayer') } }) private clickAction: Function;

  get TextOptions(): RandomTextOption[]{
    if(this.isWinner) return winningTexts;
    else return losingTexts
  };

  get Color(){
    if(this.isWinner) return "primary";
    else return "crimson";
  }

  get Message(){
    if(this.textOverride) return this.textOverride;
    return this.getRandomWeightedText().text;
  }

  beforeMount(){
  }

  getRandomWeightedText(): {text: string, score: number}{
    return this.TextOptions.map(option => {
      return {
        text: option.text,
        score: option.weight * Math.random(),
      };
    }).sort((a,b) => {
      return a.score - b.score;
    }).pop();
  }

}
</script>
