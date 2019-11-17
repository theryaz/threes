import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme:{
    dark: true,
    themes: {
      light: {
        primary: '#04BB8B',
        secondary: '#037971',
        accent: '#023436',
        // error: '',
        // warning: '',
        // info: '',
        // success: '',
      },
      dark: {
        primary: '#04BB8B',
        secondary: '#037971',
        accent: '#023436',
        // error: '',
        // warning: '',
        // info: '',
        // success: '',
      },
    },
  },
  icons: {
    iconfont: 'fa',
  },
});
