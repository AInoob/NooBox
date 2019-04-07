const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const x = {
  plugins: [
    new CopyWebpackPlugin([
      // { from: './thirdParty', to: 'thirdParty' },
      // { from: './src/manifest.json' },
      // { from: './src/js', to: 'js' },
      // { from: './src/html' },
    ])
  ],
  entry: {
    popup: ["./src/popup/popup.tsx"],
    background: ["./src/background/background.ts"],
    imageSearch: ["./src/imageSearch/imageSearch.tsx"]
  },
  output: {
    path: path.resolve("dist"),
    filename: "js/[name].js"
  },
  resolve: {
    extensions: [".webpack.js", ".js", ".jsx"]
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "awesome-typescript-loader" }]
  },
  target: "web"
};

module.exports = env => {
  const isProd = env && env.production;
  if (!isProd) {
    x.devtool = "source-map";
  }
  return x;
};
