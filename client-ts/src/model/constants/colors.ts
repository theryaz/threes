const PRIMARY_GREEN = "#04BB8B";
const SECONDARY = "#037971";
const ACCENT = "#023436";

const ONE_BLUE = "#66CCFF";
const TWO_RED = "#FF6680";

const FONT_COLOR = "#111";
const FONT_COLOR_INVERT = "#FFFFFF";
const SHADOW = "#000000";

const CRIMSON = "#B3001B";

export const IS_DARK = true;

export const COLORS = {
  primary: PRIMARY_GREEN,
  secondary: SECONDARY,
  accent: ACCENT,
  crimson: CRIMSON,
  blue: ONE_BLUE,
  SHADOW,
  light:{
    FONT_COLOR,
    FONT_COLOR_INVERT,
    gameBackground: '#EEEEEE',
    cell:{
      background: '#FFFFFF',
      one: ONE_BLUE,
      two: PRIMARY_GREEN,
    }
  },
  dark:{
    FONT_COLOR: FONT_COLOR_INVERT,
    FONT_COLOR_INVERT: FONT_COLOR,
    gameBackground: '#333333',
    cell:{
      background: '#454545',
      one: ONE_BLUE,
      two: PRIMARY_GREEN,
    }
  }
}


// $background: #FFFFFF;

// $input-disabled-foreground: #555;
// $input-disabled-background: #eee;
// $input-disabled-color: #555;

// $positive: #3cbd70;
// $negative: #d31a48;
// $warning: darken(yellow,10%);
// $neutral: gray;


// $primary-color: $blue;
// $primary-color-light: lighten($blue, 10%);
