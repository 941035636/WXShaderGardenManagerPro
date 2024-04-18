/**
 * @description cli配置
 */

const path = require('path')
const {
  publicPath,
  baseURL,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  abbreviation,
  devPort,
  providePlugin,
  build7z,
  donation,
} = require('./src/config')

const {
  version,
  author
} = require('./package.json')
const Webpack = require('webpack')
const WebpackBar = require('webpackbar')
const FileManagerPlugin = require('filemanager-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 引入整个系统公用的信息
const sysConfig = require('./sysConfig')
const dayjs = require('dayjs')
const date = dayjs().format('YYYY_M_D')
const time = dayjs().format('YYYY-M-D HH:mm:ss')
process.env.VUE_APP_TITLE = title || 'yingji-admin'
process.env.VUE_APP_AUTHOR = author || 'jt'
process.env.VUE_APP_UPDATE_TIME = time
process.env.VUE_APP_VERSION = version

const resolve = (dir) => path.join(__dirname, dir)
const mockServer = () => {
  if (process.env.NODE_ENV === 'development') {
    return require('./mock')
  } else {
    return ''
  }
}

module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    // 注释掉的地方是前端配置代理访问后端的示例
    proxy: {
      ['api']: {
        // target: `https://ab-ent-admin-dev.chinasafetyins.com`,
        target: `http://10.11.17.230:1001`,
        // target: `http://yingji-admin-dev.jiangtai.com/api`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          ['^/api']: '',
        },
      },
    },
    // after: mockServer(),
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '@': resolve('src'),
        },
      },
      externals: {
        AMap: 'AMap',
        AMapUI: 'AMapUI',
      },
      plugins: [
        new Webpack.ProvidePlugin(providePlugin),
        new Webpack.DefinePlugin({
          sysConfig: JSON.stringify(sysConfig), // 系统文件相关公共参数配置
        }),
        // new UglifyJsPlugin({
        //   uglifyOptions: {
        //     compress: {
        //       drop_console: true,
        //     },
        //   },
        // }),
      ],
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.module
      .rule('svg')
      .exclude.add(resolve('src/remixIcon'))
      .add(resolve('src/colorfulIcon'))
      .end()

    config.module
      .rule('remixIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/remixIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'remix-icon-[name]',
      })
      .end()

    config.module
      .rule('colorfulIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/colorfulIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'colorful-icon-[name]',
      })
      .end()

    /*  config.when(process.env.NODE_ENV === "development", (config) => {
      config.devtool("source-map");
    }); */
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.performance.set('hints', false)
      config.devtool('none')
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          fortawesome: {
            name: 'chunk-fortawesome',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?@fortawesome(.*)/,
          },
        },
      })
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true,
        })
        .end()
    })

    if (build7z) {
      config.when(process.env.NODE_ENV === 'production', (config) => {
        config
          .plugin('fileManager')
          .use(FileManagerPlugin, [{
            onEnd: {
              delete: [`./${outputDir}/video`, `./${outputDir}/data`],
              archive: [{
                source: `./${outputDir}`,
                destination: `./${outputDir}/${abbreviation}_${outputDir}_${date}.7z`,
              },],
            },
          },])
          .end()
      })
    }
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        /*sass-loader 8.0语法 */
        //prependData: '@import "~@/assets/styles/variables.scss";',

        /*sass-loader 9.0写法，感谢github用户 shaonialife*/
        additionalData(content, loaderContext) {
          const {
            resourcePath,
            rootContext
          } = loaderContext
          const relativePath = path.relative(rootContext, resourcePath)
          if (
            relativePath.replace(/\\/g, '/') !==
            'src/assets/styles/variables.scss'
          ) {
            return '@import "~@/assets/styles/variables.scss";' + content
          }
          return content
        },
      },
    },
  },
}