const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/assets', to: 'static' },
      { from: './public' },
    ]),
  ],
  entry: {
    popup:"./src/popup.js",
    background:"./src/background/index.js",
    imageSearch:"./src/imageSearch.js",
  },
  resolve: {
    extensions: ['.webpack.js', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          presets: ['react', ['env', {
            targets: {
              browsers: ['> 1%']
            }
          }]],
          plugins: [
            "transform-es2015-destructuring",
            "transform-es2015-parameters",
            "transform-object-rest-spread",
          ],
        },
      },
    ]
  },
  output: {
    path: path.resolve('dist'),
    filename: 'js/[name].js'
  },
  devtool: "source-map",
};
