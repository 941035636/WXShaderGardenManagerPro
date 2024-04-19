// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    online: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        host: '219.143.187.12',
        port: 9000,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api': {
                target: 'http://gw-dev.jiangtai.com/safety-man',
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                }
            },
            '/bms-api': {
                target: 'http://sequip-mweb-dev.jiangtai.com/_gw/bms-api',
                changeOrigin: true,
                pathRewrite: {
                    '/bms-api': ''
                }
            },
            '/ms': {
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            },
            '/restApi': {
                target: 'http://sequip-mweb-dev.jiangtai.com/_gw',
                changeOrigin: true,
                pathRewrite: {
                    '^/restApi': ''
                }
            },
            '/rest': {
                target: "http://10.10.71.88:6180",
                changeOrigin: true,
                pathRewrite: {
                    '^/rest': ''
                }
            },
            '/localApi': {
                target: 'https://sequip-mweb-dev.jiangtai.com/_gw',
                changeOrigin: true,
                pathRewrite: {
                    '/localApi': ''
                }
            },
        },
        cssSourceMap: false
    },
    test: {
        env: require('./test.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report

    },
    pre: {
        env: require('./pre.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report

    },
    start: {
        env: require('./devBuild.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    },
}