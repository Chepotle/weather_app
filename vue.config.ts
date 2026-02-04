module.exports = {
  publicPath: '/weather_app/',
  pwa: {
    name: 'Прогноз погоды',
    short_name: 'Погода',
    themeColor: '#00008b',
    appleMobileWebAppStatusBarStyle: '#00008b'
  },
  chainWebpack: config => {
    config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
        .type('asset')
        .set('parser', {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        })
  }
}

