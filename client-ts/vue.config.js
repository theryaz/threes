module.exports = {
  configureWebpack:{
  },
  // https://github.com/vuetifyjs/vuetify/issues/7977
  css: {
    loaderOptions: {
      sass: {
        data: '@import "src/scss/variables.scss"',
      }
    },
    sourceMap: true
  },
  chainWebpack: config => {
    ["vue-modules", "vue", "normal-modules", "normal"].forEach((match) => {
      config.module.rule('scss').oneOf(match).use('sass-loader')
          .tap(opt => Object.assign(opt, { data: `@import 'src/scss/variables.scss';` }))
    });
  }
};
