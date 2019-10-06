const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const x = {
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/assets', to: 'static' },
      { from: './thirdParty', to: 'thirdParty' },
      { from: './src/manifest.json' },
      { from: './src/js', to: 'js' },
      { from: './src/html' },
    ]),
  ],
  entry: {
    popup: ['babel-polyfill', './src/popup/popup.js'],
    background: ['babel-polyfill', './src/background/index.js'],
    imageSearch: ['babel-polyfill', './src/imageSearch/imageSearch.js'],
  },
  resolve: {
    extensions: ['.webpack.js', '.js', '.jsx'],
    alias: {
      SRC: path.resolve(__dirname, 'src/'),
      ASSET: path.resolve(__dirname, 'src/assets/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          presets: [
            'react',
            [
              'env',
              {
                targets: {
                  browsers: ['> 1%'],
                },
              },
            ],
          ],
          plugins: [
            'transform-es2015-destructuring',
            'transform-es2015-parameters',
            'transform-object-rest-spread',
          ],
        },
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve('dist'),
    filename: 'js/[name].js',
  },
};

module.exports = env => {
  if (env === 'prod') {
    x.optimization = {
      minimizer: [new UglifyJsPlugin()],
    };
  } else if (env === 'preProd') {
    x.plugins.push(new BundleAnalyzerPlugin());
  } else {
    x.devtool = 'source-map';
  }
  return x;
};
