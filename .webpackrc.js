
export default {
   extraBabelPlugins:[
    [ "import", 
      { libraryName: "antd", 
        libraryDirectory: "es", 
        style: "css" },
    ],
  ],
  copy: [
    {
      "from": "./src/assets",
      "to": "./static",
      "toType": "dir"
    }
  ],
  entry: {
    popup:"./src/popup.js",
  },
};
