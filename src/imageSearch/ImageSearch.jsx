//The router of Image search, all component is under Core2.jsx
var React= require('react');
var ReactDOM = require('react-dom');
var ImageSearch=require('./Result.jsx');

//Log page views
function logPageView(){
}

//image.search.html will be update to different pathname based on the parameter
ReactDOM.render(
  <ImageSearch />
  ,
  document.getElementById('imageSearchPage')
);
