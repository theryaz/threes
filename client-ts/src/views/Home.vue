<template>
  <v-container id="home">
    <h1>Threes</h1>
    <div class="body">
      <table>
        <tr>
          <td>
            <img id="preview" src="img/demo.gif"/>
          </td>
          <td>
            <ul>
              <li>
                Move with the arrow keys
              </li>
              <li>
                Get the highest score you can!
              </li>
            </ul>
          </td>
        </tr>
      </table>
    </div>
    <div>
      <button class="common red-primary">
        <router-link to="/play">
          Play Alone
        </router-link>
      </button>
      <button class="common blue-primary">
        <router-link to="/multiplayer">
          Play with a friend
        </router-link>
      </button>
    </div>
  </v-container>
</template>
<style lang="scss">
</style>
