
export default {
  copy: [
    {
      "from": "./src/assets",
      "to": "./static",
      "toType": "dir"
    }
  ],
  entry: {
    popup:"./src/popup.js",
    background:"./src/background/index.js",
    imageSearch:"./src/imageSearch.js",
  },
  devtool: "source-map"
};
