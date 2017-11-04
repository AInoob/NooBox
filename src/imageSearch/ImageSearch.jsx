require("babel-core/register");
require("babel-polyfill");

//The router of Image search, all component is under Core2.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import ImageSearch from './Result.jsx';

//Log page views
function logPageView(){
}

//image.search.html will be update to different pathname based on the parameter
ReactDOM.render(
  <ImageSearch />
  ,
  document.getElementById('imageSearchPage')
);
