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

	var screenshotDataURL;
	var drag = {
	  elem: null,
	  x: 0,
	  y: 0,
	  state: false
	};
	var delta = {
	  x: 0,
	  y: 0
	};
	var newSelection=false;

	function moveCursor(e) {
	  if (drag.state&&!newSelection) {
	    delta.x = e.pageX - drag.x;
	    delta.y = e.pageY - drag.y;
	    var cur_offset = $(drag.elem).offset();
	    $(drag.elem).offset({
	      left: (cur_offset.left + delta.x),
	      top: (cur_offset.top + delta.y)
	    });
	    drag.x = e.pageX;
	    drag.y = e.pageY;
	    moveCover($(e.target).parent());
	  }
	  else if(newSelection){
	    var parent=$(e.target).parent();
	    parent.find('.NooBox-screenshot-cursorBottomRight').offset({top:e.pageY-6,left:e.pageX-6});
	    moveCover($(e.target).parent());
	  }
	}
	function moveCover(parent){
	  var left1=parent.find('.NooBox-screenshot-cursorTopLeft').offset().left;
	  var top1=parent.find('.NooBox-screenshot-cursorTopLeft').offset().top;
	  var left2=parent.find('.NooBox-screenshot-cursorBottomRight').offset().left;
	  var top2=parent.find('.NooBox-screenshot-cursorBottomRight').offset().top;
	  var canvasTop=parent.find('.NooBox-screenshot-canvas').offset().top;
	  var canvasLeft=parent.find('.NooBox-screenshot-canvas').offset().left;
	  var canvasWidth=parent.find('.NooBox-screenshot-canvas').width();
	  var canvasHeight=parent.find('.NooBox-screenshot-canvas').height();
	  var left=Math.min(left1,left2);
	  var top=Math.min(top1,top2);
	  var width=Math.abs(left1-left2);
	  var height=Math.abs(top1-top2);
	  var halfBall=6;
	  var temp1=(6+top-canvasTop);
	  var temp2=(canvasWidth-(left+width)+halfBall);
	  parent.find('.NooBox-screenshot-coverTop').css({left:(0)+'px',width:(canvasWidth+halfBall)+'px',height:(top-canvasTop)+'px'});
	  parent.find('.NooBox-screenshot-coverRight').css({top:0+'px',width:temp2+'px',height:(canvasHeight+halfBall)+'px'});
	  parent.find('.NooBox-screenshot-coverBottom').css({left:'6px',width:(canvasWidth)+'px',height:(canvasHeight-(height+top-canvasTop))+'px'});
	  parent.find('.NooBox-screenshot-coverLeft').css({top:6+'px',width:(left-halfBall)+'px',height:(canvasHeight)+'px'});
	}
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if(request=='loaded'){
	      sendResponse('yes');
	    }
	    if('job' in request){
	      if(request.job=='screenshotSearch'){
	        chrome.runtime.sendMessage({job:'analytics',category:'screenshotSearch',action:'run'}, function(response) {});
	          $(document.head).append('<style>#NooBox-screenshot{margin:0px;border:0px;padding:0px;border-radius:0px}#NooBox-screenshot *{transition:none;margin:0px;border:0px;padding:0px;border-radius:0px}</style>');
	        var div=$('<div id="NooBox-screenshot" style="width:initial;z-index:999999999999999999999;border: 6px solid #6e64df;position:absolute;left:0px;top:'+document.body.scrollTop+'px;" ></div>');
	        var img=new Image;
	        img.src=request.data;
	        img.onload=function(){
	          div.append('<div class="NooBox-screenshot-search" style="cursor:pointer;box-sizing: content-box;height: '+($(window).height()-29-11-(($(window).height()-250)/2))+'px;width: 35px;float: right;padding-top: '+($(window).height()-250)/2+'px;text-align: center;background-color:rgba(130, 186, 255, 0.8);font-size: 44px;word-wrap: break-word;line-height: 44px;">'+chrome.i18n.getMessage('search')+'!!!</div>');
	          div.append('<canvas width='+img.width+' height='+img.height+' style="border:6px dashed pink;height:'+($(window).height()-52)+'px" class="NooBox-screenshot-canvas"></canvas>');
	          div.append('<div class="NooBox-screenshot-switch" style="margin-top:-3px;cursor:pointer;user-select: none;width: 100%;height: 29px;font-size: 30px;text-align: center;line-height: 30px;background: rgba(193, 22, 59, 0.8);">'+chrome.i18n.getMessage('close')+'</div>');
	          div.append('<div class="NooBox-screenshot-cursorTopLeft NooBox-shiny" style="z-index:3;cursor:crosshair;left:-7px;top:-7px;position:absolute;border-radius:50%;width:12px;height:12px"></div>');
	          div.append('<div class="NooBox-screenshot-cursorBottomRight NooBox-shiny" style="z-index:3;cursor:crosshair;left:'+($(window).height()-52)/img.height*img.width+'px;top:'+($(window).height()-52)+'px;position:absolute;border-radius:50%;width:12px;height:12px"></div>');
	          div.append('<div class="NooBox-screenshot-coverTop" style="pointer-events: none;position:absolute;top:6px;background-color:rgba(0,0,0,0.418)"></div>');
	          div.append('<div class="NooBox-screenshot-coverRight" style="left:initial;pointer-events: none;position:absolute;right:41px;background-color:rgba(0,0,0,0.418)"></div>');
	          div.append('<div class="NooBox-screenshot-coverBottom" style="pointer-events: none;position:absolute;bottom:37px;background-color:rgba(0,0,0,0.418)"></div>');
	          div.append('<div class="NooBox-screenshot-coverLeft" style="pointer-events: none;position:absolute;left:6px;background-color:rgba(0,0,0,0.418)"></div>');
	          $('body').append(div);
	          $('body').append('<style>@keyframes shiny{0%{background-color:white}20%{background-color:yellow}40%{background-color:red}60%{background-color:black}80%{background-color:blue}} .NooBox-shiny{animation: shiny 5s infinite}</style>');
	          $('.NooBox-screenshot-switch').on('click',function(e){
	            $(e.target).parent().remove();
	          });
	          $('.NooBox-screenshot-cursorTopLeft').on('mousedown',function(e){
	            if(!drag.state){
	              drag.elem = this;
	              drag.x = e.pageX;
	              drag.y = e.pageY;
	              drag.state = true;
	            }
	          });
	          $('.NooBox-screenshot-cursorBottomRight').on('mousedown',function(e){
	            if(!drag.state){
	              drag.elem = this;
	              drag.x = e.pageX;
	              drag.y = e.pageY;
	              drag.state = true;
	            }
	          });
	          $('.NooBox-screenshot-canvas').on('mousedown',function(e){
	            if(!newSelection){
	              newSelection=true;
	              var parent=$(e.target).parent();
	              parent.find('.NooBox-screenshot-cursorTopLeft').offset({top:e.pageY,left:e.pageX});
	              moveCover($(e.target).parent());
	            }
	          });
	          $('.NooBox-screenshot-canvas').on('mouseup',function(e){
	            if(newSelection){
	              newSelection=false;
	            }
	          });
	          $('.NooBox-screenshot-cursorBottomRight').on('mouseup',function(e){
	            if(newSelection){
	              newSelection=false;
	            }
	          });
	          $(document).mousemove(moveCursor);
	          $(document).mouseup(function() {
	            if (drag.state) {
	              drag.state = false;
	            }
	          });
	          $('.NooBox-screenshot-search').on('click',function(e){
	            var left1=$(e.target).parent().find('.NooBox-screenshot-cursorTopLeft').offset().left;
	            var top1=$(e.target).parent().find('.NooBox-screenshot-cursorTopLeft').offset().top;
	            var left2=$(e.target).parent().find('.NooBox-screenshot-cursorBottomRight').offset().left;
	            var top2=$(e.target).parent().find('.NooBox-screenshot-cursorBottomRight').offset().top;
	            var left=Math.min(left1,left2)+2;
	            var top=Math.min(top1,top2)+1;
	            var width=Math.abs(left1-left2);
	            var height=Math.abs(top1-top2);
	            var canvasTop=$(e.target).parent().find('.NooBox-screenshot-canvas').offset().top;
	            var canvasLeft=$(e.target).parent().find('.NooBox-screenshot-canvas').offset().left;
	            var ratio=img.height/$(e.target).parent().find('.NooBox-screenshot-canvas').height();
	            var imgData=$(e.target).parent().find('.NooBox-screenshot-canvas')[0].getContext('2d').getImageData((left-canvasLeft)*ratio,(top-canvasTop)*ratio,(width)*ratio,(height)*ratio);
	            var canvas1 = document.createElement("canvas");
	            canvas1.width=(width)*ratio;
	            canvas1.height=(height)*ratio;
	            var ctx=canvas1.getContext('2d');
	            ctx.putImageData(imgData,0,0);
	            var dataURL=canvas1.toDataURL();
	            chrome.extension.sendMessage({job: 'imageSearch_upload',data:dataURL});
	          });
	          setTimeout(loadScreenshot,300);
	        }
	        var loadScreenshot=function(){
	          var canvas=$('.NooBox-screenshot-canvas').last()[0];
	          if(!canvas){
	            setTimeout(loadScreenshot,300);
	          }
	          else{
	            var ctx=canvas.getContext('2d');
	            ctx.drawImage(img,0,0);
	          }
	        }
	      }
	    }
	  }
	);


/***/ })
/******/ ]);