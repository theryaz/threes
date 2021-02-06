import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { Touch } from 'vuetify/lib/directives';
import { IS_DARK, COLORS } from '../model/constants';

Vue.use(Vuetify);
Vue.directive('touch', Touch);

export default new Vuetify({
  breakpoint:{
    mobileBreakpoint: "md",
  },
  theme:{
    dark: IS_DARK,
    themes: {
      light: {
        primary: COLORS.primary,
        secondary: COLORS.secondary,
        accent: COLORS.accent,
        crimson: COLORS.crimson,
        blue: COLORS.blue,
        // error: '',
        // warning: '',
        // info: '',
        // success: '',
      },
      dark: {
        primary: COLORS.primary,
        secondary: COLORS.secondary,
        accent: COLORS.accent,
        crimson: COLORS.crimson,
        blue: COLORS.blue,
        // error: '',
        // warning: '',
        // info: '',
        // success: '',
      },
    },
  },
  icons: {
    iconfont: "faSvg",
  },
});
