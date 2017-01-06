var path=require('path');
module.exports={
  entry: {
    noobox:'./pre/NooBox.jsx',
    imageSearch:'./pre/ImageSearch.jsx'
  },
  output: {
    path: 'js',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react']
        }
      }
    ]
  }
}
