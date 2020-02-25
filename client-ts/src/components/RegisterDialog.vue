<template>
  <v-dialog v-bind="$attrs" v-on:input="onClose">
    <!-- v-on:click:outside="onClose" :persistent="persistent" :value="show" max-width="400" -->
    <v-form ref="signupForm" v-model="signupFormValid" @submit="onSubmit">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <AvatarSelector
                  v-on:change="onAvatarChange"
                  :color="userStore.color"
                  :avatarIcon="userStore.avatarIcon"
                  :avatarUrl="userStore.avatarUrl"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Username"
                  :rules="usernameRules"
                  required
                  v-model="signupForm.username"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-expand-transition>
              <v-row v-if="isRegistering">
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
          <!-- <v-btn text color="blue darken-2" @click="onHasAccount">
            <small>I have an account.</small>
          </v-btn> -->
          <!-- <v-switch inset class="ml-5" color="primary" v-model="isRegistering" label="Remember me"></v-switch> -->
          <v-spacer></v-spacer>
          <v-switch inset color="white" v-model="isDark">
            <template v-slot:label>
              <v-icon>
                fa-adjust
              </v-icon>
            </template>
          </v-switch>
          <v-btn
            class="ml-4 mr-5"
            type="submit"
            color="primary darken-1"
            :disabled="!signupFormValid"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

</template>
<script lang="ts">
import { mapState } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';

import PlayerCard from '../components/PlayerCard.vue';
import AvatarSelector from '../components/AvatarSelector.vue';

import UserModule from '../store/user/user.store';
const userStore = getModule(UserModule);

@Component({
  components: { PlayerCard, AvatarSelector },
  computed: {
    ...mapState(['userStore']),
  },
})
export default class RegisterDialog extends Vue{

  $refs!:{
    signupForm: any,
  };
  private signupFormValid: boolean = false;
  private signupForm = {
    color: userStore.color,
    avatarIcon: userStore.avatarIcon,
    username: userStore.username,
    password1: "",
    password2: "",
  };

  private isRegistering: boolean = false;
  
  private isDark: boolean = this.$vuetify.theme.dark;
  @Watch('isDark') setDarkMode(newVal){
    this.$vuetify.theme.dark = newVal;
    window.localStorage.setItem("useDarkMode", newVal);
  }

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

  onAvatarChange({ color, avatarIcon }){
    this.signupForm.color = color;
    this.signupForm.avatarIcon = avatarIcon;
  }

  onHasAccount(){
    this.$emit('onHasAccount',{
      ...this.signupForm
    });
  }

  onSubmit($event: Event){
    // console.log("[RegisterDialog.vue] onSubmit");
    $event.preventDefault();
    if(this.isRegistering == false){
      this.$emit('onSetTempUser', {
        username: this.signupForm.username,
        color: this.signupForm.color,
        avatarIcon: this.signupForm.avatarIcon,
      });
      this.onClose();
    }else{
      this.$emit('onRegister', {
        ...this.signupForm
      });
      this.onClose();
    }
  }

  onClose(){
    this.$emit('onClose');
  }

}
</script>