const path = require('path')
function addStyleResource (rule) {
  rule.use('style-resource')
      .loader('style-resources-loader')
      .options({
        patterns: [
          path.resolve(__dirname, './src/assets/styles/_variables.styl'),
        ],
      })
}
module.exports = {
  css: {
    loaderOptions: {
      css: {
        localsConvention: 'camelCaseOnly'
      }
    }
  },
  pages: {
    index: {
      // page 的入口
      entry: ['./src/main.js'],
      // 模板来源
      template: './public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html'
    }

  },
  chainWebpack: config => {
    config.module.rule('pug')
        .test(/\.pug$/)
        .use('pug-html-loader')
        .loader('pug-html-loader')
        .end()

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))

  },
  devServer: {
    proxy: {
      '/m/api/base': {
        target: 'http://localhost:8001/',
        ws: true,
        changeOrigin: true
      }
    }
  }
}