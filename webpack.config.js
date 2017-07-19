const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
module.exports = {
  entry: {
    noobox: './src/popup/NooBox.jsx',
    imageSearch: './src/imageSearch/ImageSearch.jsx',
		background: './src/background/background.js',
		util: './src/js/util.js',
		extractImages: './src/js/extractImages.js',
		options: './src/js/options.js',
		screenshotSearch: './src/js/screenshotSearch.js',
		videoBeyond: './src/js/videoBeyond.js',
		videoControl: './src/js/videoControl.js',
  },
  output: {
    path: 'dest',
    filename: 'js/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
		new CopyWebpackPlugin([
			{ from: './src/options.html' },
			{ from: './src/popup/popup.html' },
			{ from: './src/imageSearch/image.search.html' },
		])
  ]
}
