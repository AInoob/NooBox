
const path = require('path');

export default {
  copy: [
    {
      "from": "./src/assets",
      "to": "./static",
      "toType": "dir"
    }
  ],
  extraBabelPlugins: [
    ['import', {"libraryName": 'antd', "libraryDirectory": 'es', "style": true }],
  ],
  entry: {
    popup:"./src/popup.js",
    background:"./src/background/index.js",
    imageSearch:"./src/imageSearch.js",
  },
  devtool: "source-map",
};
