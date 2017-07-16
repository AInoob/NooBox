const webpack = require('webpack');
var path=require('path');
module.exports={
  entry: {
    noobox:'./src/NooBox.jsx',
    imageSearch:'./src/ImageSearch.jsx'
  },
  output: {
    path: 'dist/js',
    filename: '[name].js'
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
    })
  ]
}
