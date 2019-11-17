<template>
  <v-container id="home">
    <v-row>
      <v-col>
        <Game />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="text-center">
        <router-link to="/play">
          <v-btn color="secondary">
              Play Alone
          </v-btn>
        </router-link>
      </v-col>
      <v-col cols="6" class="text-center">
        <router-link to="/multiplayer">
          <v-btn color="primary">
              Play with a friend
          </v-btn>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss">
  @import "../scss/colors";
  @import "../scss/buttons";

  #home{
    height: 100vh;
    display: flex;
    box-sizing: border-box;
    padding: 10px;
    flex-direction: column;
    .body{
      flex-grow: 1;
    }
  }
  button.common{
    margin: 2.0rem 1.0rem;
  }
  .body{
    table{
      margin: auto;
      max-width: 400px;
      ul{
        padding: 5px;
      }
      li{
        // list-style: none;
        padding: 5px;
        text-align: left;
      }
    }
    img#preview{
      height: 200px;
    }
  }
</style>
