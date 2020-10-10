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