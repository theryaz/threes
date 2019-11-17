<template>
  <v-dialog persistent v-model="show" max-width="400">
    <v-form ref="signupForm" v-model="signupFormValid" @submit="onSubmit">
      <v-card>
        <v-card-title class="text-center">
          <span class="headline">
            Set a username to begin!
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="10" offset="2">
                <v-switch color="primary" hide-details v-model="isRegistering" label="Create an account"></v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Username"
                  :rules="usernameRules"
                  :hint="usernameHint"
                  required
                  v-model="signupForm.username"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-expand-transition>
              <v-row v-if="isRegistering">
                  <v-col cols="12">
                    <v-text-field
                      type="email"
                      label="Email Address"
                      :rules="emailRules"
                      v-model="signupForm.email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      type="password"
                      :required="isRegistering"
                      label="Password"
                      :rules="password1Rules"
                      v-model="signupForm.password1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      type="password"
                      :required="isRegistering"
                      :rules="password2Rules"
                      label="Repeat Password"
                      v-model="signupForm.password2"
                    ></v-text-field>
                  </v-col>
              </v-row>
            </v-expand-transition>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="blue darken-2" @click="onHasAccount">
            <small>I have an account.</small>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            v-if="isRegistering"
            color="primary darken-1"
            :disabled="!signupFormValid"
          >Register</v-btn>
          <v-btn
            type="submit"
            v-else
            color="primary darken-1"
            :disabled="!signupFormValid"
          >Continue</v-btn>
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
export default class RegisterDialog extends Vue{

  @Prop({default: false, type: Boolean}) show: boolean;
  
  $refs!:{
    signupForm: any,
  };
  private signupFormValid: boolean = false;
  private signupForm = {
    username: "",
    email: "",
    password1: "",
    password2: "",
  };

  private isRegistering: boolean = false;


  get usernameHint(){
    return this.isRegistering ? "" : "Make a temporary username";
  }

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
      v => /.+@.+/.test(v) || 'E-mail must be valid',
    ];
  }
  get password1Rules(){
    return [
      v => !!v || 'Password is required',
      v => v.length >= 8 || 'Password must be at least 8 characters',
    ];
  }
  get password2Rules(){
    return [
      v => v === this.signupForm.password1 || 'Passwords do not match',
    ];
  }

  onHasAccount(){
    this.$emit('onHasAccount',{
      ...this.signupForm
    });
  }

  onSubmit($event: Event){
    console.log("[RegisterDialog.vue] onSubmit");
    $event.preventDefault();
    if(this.isRegistering == false){
      this.$emit('onContinue', {
        username: this.signupForm.username
      });
    }else{
      this.$emit('onRegister', {
        ...this.signupForm
      });
    }
  }

}
</script>