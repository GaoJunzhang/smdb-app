const path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

function resolve (dir) {
  return path.join(__dirname, dir)
}

function isProd () {
  return process.env.NODE_ENV === 'production'
}

const assetsCDN = {
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  ]
}

// webpack build externals
const prodExternals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios'
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new ThemeColorReplacer({
        fileName: 'css/theme-colors.css',
        matchColors: getAntdSerials('#1890ff') // 主色系列
      })
    ],
    externals: isProd() ? prodExternals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    // if prod is on
    // assets require on cdn
    if (isProd()) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    host: '127.0.0.1',
    // development server port 8000
    port: 9999,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '/zboot': {
        target: 'http://127.0.0.1:8888',
        ws: false,
        changeOrigin: true
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

function getAntdSerials (color) {
  var lightens = new Array(9).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10)
  })
  // 此处为了简化，采用了darken。实际按color.less需求可以引入tinycolor, colorPalette变换得到颜色值
  var darkens = new Array(6).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.darken(color, i / 10)
  })
  return lightens.concat(darkens)
}

// preview.pro.loacg.com only do not use in your production;
if (isProd()) {
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(new CompressionWebpackPlugin({
    algorithm: 'gzip',
    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
    threshold: 10240,
    minRatio: 0.8
  }))
  vueConfig.configureWebpack.plugins.push(new ThemeColorReplacer())
}

module.exports = vueConfig
