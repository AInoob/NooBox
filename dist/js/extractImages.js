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

	function get(key, callback) {
	  chrome.storage.sync.get(key, function(result) {
	    if (callback)
	      callback(result[key]);
	  });
	}

	function isOn(key, callbackTrue, callbackFalse, param) {
	  get(key, function(value) {
	    if (value == '1') {
	      if (callbackTrue) {
	        callbackTrue(param);
	      }
	    } else {
	      if (callbackFalse) {
	        callbackFalse(param);
	      }
	    }
	  });
	}

	let imgSet = {};
	const notImgSet = {};
	const isImgSet = {};
	let focus = null;

	function getImages() {
	  const linkImage = $('#linkImage').prop('checked');
	  let notification = false;
	  const val = $('#NooBox-extractImages-selector-range').val();
	  const gallery = $('#NooBox-extractImages-gallery')[0];
	  $(gallery).empty();
	  imgSet = {};
	  let tempFocus2 = focus;
	  for (let i = 1; i < val; i++) {
	    tempFocus2 = $(tempFocus2).parent()[0];
	  }
	  getAllImgs = function(elem) {
	    $(elem).find('*').each(function() {
	      if (this.tagName == "IMG") {
	        imgSet[this.src] = true;
	      } else {
	        const bg = $(this).css('background-image');
	        if (bg) {
	          const url = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
	          if (url != 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTIuNTE5IDUyLjUxOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTIuNTE5IDUyLjUxOTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiMyNkI5OUE7IiBkPSJNMTYuMDQ5LDMxLjEzN0g0LjAwMWwyMC4wOCwxOS45NzFsMjAuMDgtMTkuOTcxSDMyLjExM2MwLDAtNC4yOTItMTcuNzM1LDE2LjA2NC0yOS44NDljMCwwLTE1LjUzNi0zLjAyLTI2Ljc5NCwxMC41MUMyMS4zODIsMTEuNzk3LDE1LjY1MSwxNy45MjcsMTYuMDQ5LDMxLjEzN3oiLz48cGF0aCBzdHlsZT0iZmlsbDojMjZCOTlBOyIgZD0iTTI0LjA4MSw1Mi41MTlMMS41NzcsMzAuMTM3SDE1LjAzYy0wLjA5Mi0xMi43NTksNS4zODMtMTguNzY3LDUuNjIyLTE5LjAyMkMyOC42OTEsMS40NSwzOC45MzMsMCw0NC4zMTgsMGMyLjQ0NiwwLDMuOTg1LDAuMjk0LDQuMDQ5LDAuMzA3bDIuNTc0LDAuNWwtMi4yNTMsMS4zNDFDMzEuMzcxLDEyLjQ1MywzMi4zOTQsMjYuNjYzLDMyLjk0LDMwLjEzN2gxMy42NDVMMjQuMDgxLDUyLjUxOXogTTYuNDI1LDMyLjEzN2wxNy42NTYsMTcuNTYybDE3LjY1Ni0xNy41NjJIMzEuMzI2bC0wLjE4NS0wLjc2NWMtMC4wNDMtMC4xNzctMy44ODEtMTcuMDgyLDE0LjA0MS0yOS4zNThjLTQuNzg0LTAuMTUtMTUuMDIsMC43OTUtMjMuMDMxLDEwLjQyM2MtMC4wOTEsMC4xLTUuNDgxLDYuMDg5LTUuMTAzLDE4LjY3bDAuMDMsMS4wM0g2LjQyNXoiLz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+' && url != "none" && (!url.match(/^gradient/)) && (!url.match(/^linear-gradient/))) {
	            imgSet[url] = true;
	          }
	        }
	      }
	      if (linkImage && this.tagName == 'A') {
	        if (isImgSet[this.href] == true) {
	          imgSet[this.href] = true;
	        } else {
	          if (!notImgSet[this.href] == true) {
	            getValidImage(this.href);
	          }
	        }
	      }
	      if (this.tagName == 'IFRAME') {
	        if (!notification) {
	          notification = true;
	        }
	        //getAllImgs(this.contentDocument);
	      }
	    });
	  }
	  getAllImgs(tempFocus2);
	  Object.keys(imgSet).forEach(function(elem) {
	    $(gallery).append('<img src="' + elem + '" style="margin:0px;border:0px;padding:0px;max-width:100%;" />');
	  });
	  //location.href = "#NooBox-extractImages-selector-range"; 
	}

	function getValidImage(url) {
	  if (url && url.length > 0 && (!notImgSet[url] == true)) {
	    const img = $('<img src="' + url + '">');
	    $(img).on('error', function() {
	      notImgSet[url] = true;
	    });
	    $(img).on('load', function() {
	      if (!imgSet[url] == true) {
	        const gallery = $('#NooBox-extractImages-gallery')[0];
	        imgSet[url] = true;
	        isImgSet[url] = true;
	        $(gallery).append('<img src="' + url + '" style="margin:0px;border:0px;padding:0px;max-width:100%;" />');
	      }
	    });
	  }
	}

	window.oncontextmenu = function(e) {
	  focus = e.target;
	}
	const init = function() {
	  isOn("extractImages", function() {
	    chrome.runtime.onMessage.addListener(
	      function(request, sender, sendResponse) {
	        if (request.job) {
	          if (request.job == "extractImages") {
	            $(document.head).append('<style>#NooBox-extractImages,#NooBox-extractImages *{margin:0;padding:0;border-radius:0;background:none}input[type="checkbox"] ~ .inputLabel{cursor:pointer;position:absolute;margin-top: -18px !important;margin-left: 19px !important;width: 174px;height: 28px;border: 4px solid transparent;border-bottom: 4px solid #5667bb;-webkit-transform: rotate(4deg);transform: rotate(4deg);}input[type="checkbox"]:checked ~ .inputLabel{margin-top:-12px;margin-left:163px;width: 18px;height: 38px;border: 4px solid transparent;border-right: 4px solid #5667bb;border-bottom: 4px solid #5667bb;-webkit-transform: rotate(40deg);transform: rotate(40deg);}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none!important;background-color:#E9E9E9;border:1pxsolid#CECECE;height:15px;width:15px;}#NooBox-extractImages-download{width:20px;height:20px;float: left;cursor:pointer;background-size: 20px 20px;background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTIuNTE5IDUyLjUxOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTIuNTE5IDUyLjUxOTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiMyNkI5OUE7IiBkPSJNMTYuMDQ5LDMxLjEzN0g0LjAwMWwyMC4wOCwxOS45NzFsMjAuMDgtMTkuOTcxSDMyLjExM2MwLDAtNC4yOTItMTcuNzM1LDE2LjA2NC0yOS44NDljMCwwLTE1LjUzNi0zLjAyLTI2Ljc5NCwxMC41MUMyMS4zODIsMTEuNzk3LDE1LjY1MSwxNy45MjcsMTYuMDQ5LDMxLjEzN3oiLz48cGF0aCBzdHlsZT0iZmlsbDojMjZCOTlBOyIgZD0iTTI0LjA4MSw1Mi41MTlMMS41NzcsMzAuMTM3SDE1LjAzYy0wLjA5Mi0xMi43NTksNS4zODMtMTguNzY3LDUuNjIyLTE5LjAyMkMyOC42OTEsMS40NSwzOC45MzMsMCw0NC4zMTgsMGMyLjQ0NiwwLDMuOTg1LDAuMjk0LDQuMDQ5LDAuMzA3bDIuNTc0LDAuNWwtMi4yNTMsMS4zNDFDMzEuMzcxLDEyLjQ1MywzMi4zOTQsMjYuNjYzLDMyLjk0LDMwLjEzN2gxMy42NDVMMjQuMDgxLDUyLjUxOXogTTYuNDI1LDMyLjEzN2wxNy42NTYsMTcuNTYybDE3LjY1Ni0xNy41NjJIMzEuMzI2bC0wLjE4NS0wLjc2NWMtMC4wNDMtMC4xNzctMy44ODEtMTcuMDgyLDE0LjA0MS0yOS4zNThjLTQuNzg0LTAuMTUtMTUuMDIsMC43OTUtMjMuMDMxLDEwLjQyM2MtMC4wOTEsMC4xLTUuNDgxLDYuMDg5LTUuMTAzLDE4LjY3bDAuMDMsMS4wM0g2LjQyNXoiLz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+);}#NooBox-extractImages-downloadRemaining{color:white;float:left}</style>');
	            if (!focus || focus.tagName == 'HTML') {
	              focus = document.body;
	            }
	            sendResponse({
	              success: true
	            });
	            chrome.runtime.sendMessage({
	              job: 'analytics',
	              category: 'extractImage',
	              action: 'run'
	            }, function(response) {});
	            const images = [];
	            const height = window.innerHeight - 66;
	            const width = window.innerWidth;
	            const div = $('<div id="NooBox-extractImages">').css({
	              "z-index": "999999999999999999999",
	              "height": height * 0.9 + "px",
	              "overflow": "auto",
	              "background-color": "rgba(0,0,0,0.7)",
	              "padding": "33px",
	              "position": "fixed",
	              "margin-left": "20%",
	              "width": "60%",
	              "top": height * 0.05 + "px"
	            });
	            let max = 1;
	            let tempFocus = focus;
	            while (tempFocus.tagName != 'BODY') {
	              tempFocus = $(tempFocus).parent()[0];
	              max++;
	            }
	            div.append('<div><span id="NooBox-extractImages-selector-left" style="user-select: none;line-height:16px;margin:0px;cursor:pointer;border:0px;padding:0px;z-index:999999999999999999999;margin-top:0px;display:block;float:left;color:white;font-size:33px"><</span><input type="range" id="NooBox-extractImages-selector-range" style="-webkit-appearance: none;background-color:rgb(86, 103, 187);margin:0px;margin-left:13px;border:0px;padding:0px;display:block;float:left;pointer-events: none;height:8px;margin-top:4px;width:200px" value="1" min="1" max="' + max + '" step="1"><span id="NooBox-extractImages-selector-right" style="user-select: none;line-height:16px;margin:0px;margin-left:13px;cursor:pointer;border:0px;padding:0px;margin-top:0px;display:block;float:left;color:white;font-size:60px">></span><div style="position:relative;overflow:visible;height:18px;width:200px;float:left"><input type="checkbox" style="display:none" id="linkImage"><label class="inputLabel" id="linkImageLabel" for="linkImage" ></label><a style="color: white;margin-left: 30px;text-decoration: underline;font-size:15px">example.com/a.jpg</a></div><div id="NooBox-extractImages-download"></div><div id="NooBox-extractImages-downloadRemaining"></div></div>');
	            div.append('<div id="NooBox-extractImages-switch" style="margin: 0px;border: 0px;padding: 0px;color: white;font-size: 62px;position: fixed;right:20%;top:' + height * 0.05 + 'px;width: 64px;height: 64px;background-color: rgb(86, 103, 187);text-align: center;line-height: 64px;cursor: pointer;">X</>');
	            div.append('<div style="margin:0px;border:0px;padding:0px;clear:both"></div>');
	            if (focus.tagName != 'BODY' && focus.tagName != 'HTML')
	              focus = $(focus).parent()[0];
	            const div2 = $('<div id="NooBox-extractImages-gallery" style="margin:0px;border:0px;padding:0px;width:80%;margin-top:32px"></div>');
	            div.append(div2);
	            $(document.body).append(div);
	            getImages();
	            $('body').on('keyup', '#NooBox-extractImages', function(e) {
	              console.log(e.keyCode);
	              if (e.keyCode === 27) {
	                $(e.target).remove();
	              }
	            });
	            $('#NooBox-extractImages-selector-left').on('click', function(e) {
	              let val = parseInt($('#NooBox-extractImages-selector-range').val());
	              val--;
	              $('#NooBox-extractImages-selector-range').val(val);
	              getImages();
	            });
	            $('#NooBox-extractImages-selector-right').on('click', function(e) {
	              let val = parseInt($('#NooBox-extractImages-selector-range').val());
	              val++;
	              $('#NooBox-extractImages-selector-range').val(val);
	              getImages();
	            });
	            $('#NooBox-extractImages-selector-range').on('change', function(e) {
	              getImages();
	            });
	            $('#NooBox-extractImages-switch').on('click', function(e) {
	              $(e.target).parent().remove();
	            });
	            $('#NooBox-extractImages-download').on('click', function(e) {
	              const files = [];
	              Object.keys(imgSet).forEach(function(elem, index) {
	                let i = index;
	                files.push({
	                  name: i,
	                  url: elem
	                });

	              });
	              chrome.runtime.sendMessage({
	                job: 'urlDownloadZip',
	                files: files
	              }, function(response) {});
	            });
	            $('#linkImageLabel').on('click', function(e) {
	              getImages();
	            });
	          } else if (request.job == 'downloadRemaining') {
	            $('#NooBox-extractImages-downloadRemaining').text((request.total - request.remains) + '/' + request.total);
	          }
	        }
	      }
	    );
	  });
	}
	init();


/***/ })
/******/ ]);