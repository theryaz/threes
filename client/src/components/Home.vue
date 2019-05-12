<template>
  <div id="home">
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
  </div>
</template>

<script>

export default {
  name: 'Home',
  mounted(){
  },
  data() {
    return {}
  },
  methods:{
  }
}
</script>

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
