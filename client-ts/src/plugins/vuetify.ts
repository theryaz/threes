import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { IS_DARK, COLORS } from '../model/constants';

Vue.use(Vuetify);

export default new Vuetify({
  theme:{
    dark: IS_DARK,
    themes: {
      light: {
        primary: COLORS.primary,
        secondary: COLORS.secondary,
        accent: COLORS.accent,
        // error: '',
        // warning: '',
        // info: '',
        // success: '',
      },
      dark: {
        primary: COLORS.primary,
        secondary: COLORS.secondary,
        accent: COLORS.accent,
        // error: '',
        // warning: '',
        // info: '',
        // success: '',
      },
    },
  },
  icons: {
    iconfont: "fa",
  },
});
