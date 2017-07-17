/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	let beyondCtx = null;
	document.addEventListener("DOMContentLoaded", () => {
	  isOn('videoControl', () => {
	    $('body').append('<div id="NooBox-VideoBeyond" style="position:fixed;left:0;top:0"><canvas style="width:800px;height:500px" id="NooBox-VideoBeyond-canvas"></canvas></div>');
	    const canvas = $('#NooBox-VideoBeyond-canvas')[0];
	    const ctx = canvas.getContext('2d');
	    beyondCtx = ctx;
	    chrome.runtime.onMessage.addListener(
	      (request, sender, sendResponse) => {
	        if (request.job == 'videoBeyond') {
	          let prev = request.prev;
	          temp = new Date().getTime();
	          console.log('4 getMessage: ' + (temp - prev));
	          const img = new Image;
	          img.src = request.dataURI;
	          temp = new Date().getTime();
	          console.log('5 image: ' + (temp - prev));
	          ctx.drawImage(img, 0, 0);
	          temp = new Date().getTime();
	          console.log('6 done: ' + (temp - prev));
	          prev = temp;
	        }
	      }
	    );
	  });
	});


/***/ })
/******/ ]);