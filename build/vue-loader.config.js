module.exports = {
  preserveWhitespace: false,
  postcss: [
    require('autoprefixer')({
      browsers: ['last 3 versions']
    })
  ],
  loaders: {
    'stylus': 'vue-style-loader!css-loader!stylus-loader'
  }
}
