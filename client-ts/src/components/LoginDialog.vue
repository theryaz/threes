<template>
  <v-dialog persistent v-model="show" max-width="400">
    <v-form ref="loginForm" v-model="loginFormValid" @submit="onSubmit">
      <v-card>
        <v-card-title class="text-center">
          <span class="headline">
            Login
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Email"
                  :rules="emailRules"
                  required
                  v-model="loginForm.email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Password"
                  :rules="passwordRules"
                  type="password"
                  required
                  v-model="loginForm.password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="blue darken-2" @click="onGoRegister">
            <small>Register</small>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="primary darken-1"
            :disabled="!loginFormValid"
          >Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

</template>
<script lang="ts">
import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import { Component, Vue, Prop} from 'vue-property-decorator';
import PlayerCard from '../components/PlayerCard.vue';

import UserModule from '../store/user/user.store';
const userStore = getModule(UserModule);

@Component({
  components: { PlayerCard },
})
export default class LoginDialog extends Vue{

  @Prop({default: false, type: Boolean}) show: boolean;
  
  $refs!:{
    loginForm: any,
  };
  private loginFormValid: boolean = false;
  private loginForm = {
    email: "",
    password: "",
  };

  get usernameRules(){
    return [
      v => !!v || 'Username is required',
      v => v.length <= 32 || 'Username must be less than 32 characters',
      v => /^[a-zA-Z0-9\_]+$/.test(v) || 'Username can only contain letters, numbers and _',
    ];
  }
  get emailRules(){
    return [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'Email is not valid',
    ];
  }
  get passwordRules(){
    return [
      v => !!v || 'Password is required',
    ];
  }

  onSubmit($event: Event){
    console.log("[LoginDialog.vue] onSubmit");
    $event.preventDefault();

    this.$emit('onLogin', {
      ...this.loginForm
    });
  }

  onGoRegister(){
    this.$emit('onGoRegister',{
      ...this.loginForm
    });
  }

}
</script>