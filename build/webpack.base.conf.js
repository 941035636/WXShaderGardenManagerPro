var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	entry: {
		app: ['babel-polyfill', './src/main.js']
	},
	output: {
		path: config.online.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production' ?
			config.online.assetsPublicPath : config.dev.assetsPublicPath
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		modules: [
			resolve('src'),
			resolve('node_modules')
		],
		alias: {
			'vue$': 'vue/dist/vue.common.js',
			'src': resolve('src'),
			'@': resolve('src'),
			'assets': resolve('src/assets'),
			'components': resolve('src/components'),
			'styles': resolve('src/assets/styles')
		}
	},
	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader'
				// options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [
				resolve('src'), 
				resolve('test'),
				resolve('/node_modules/_element-ui@2.4.8@element-ui/src'),
				resolve('/node_modules/_element-ui@2.4.8@element-ui/packages'),
				resolve('/node_modules/_element-ui@2.4.8@element-ui/src/mixins/emitter.js'),
				resolve('/node_modules/_element-ui@2.4.8@element-ui/src/utils/merge.js'),
				resolve('/node_modules/_element-ui@2.4.8@element-ui/src/utils/util.js')
			]
				
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
			// {
			// 	test: /\.scss$/,
			// 	loaders: ['style', 'css', 'sass']
			// 	}
			
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			// $: 'jquery',
			// jQuery: 'jquery',
			// 'windows.jQuery': 'jquery'
		})
	]
}
