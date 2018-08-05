var screenshotDataURL;
var halfBall = 6;
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
var newSelection = false;

function moveCursor(e) {
  if (drag.state && !newSelection) {
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
  } else if (newSelection) {
    var parent = $(e.target).parent();
    parent.find('.NooBox-screenshot-cursorBottomRight').offset({
      top: e.pageY - 6,
      left: e.pageX - 6
    });
    moveCover($(e.target).parent());
  }
}

function moveCover(parent) {
  var left1 = parent.find('.NooBox-screenshot-cursorTopLeft').offset().left;
  var top1 = parent.find('.NooBox-screenshot-cursorTopLeft').offset().top;
  var left2 = parent.find('.NooBox-screenshot-cursorBottomRight').offset().left;
  var top2 = parent.find('.NooBox-screenshot-cursorBottomRight').offset().top;
  var canvasTop = parent.find('.NooBox-screenshot-canvas').offset().top;
  var canvasLeft = parent.find('.NooBox-screenshot-canvas').offset().left;
  var canvasWidth = parent.find('.NooBox-screenshot-canvas').width();
  var canvasHeight = parent.find('.NooBox-screenshot-canvas').height();
  var left = Math.min(left1, left2);
  var top = Math.min(top1, top2);
  var bottom = Math.max(top1, top2);
  var right = Math.max(left1, left2);
  var width = Math.abs(left1 - left2);
  var height = Math.abs(top1 - top2);
  parent.find('.NooBox-screenshot-coverTop').css({
    top: (top + halfBall) + 'px',
    left: (left + halfBall) + 'px',
    width: (right - left) + 'px',
    height: (bottom - top) + 'px',
  });
  var buttonLeft = right + 2 * halfBall,
      buttonTop = bottom + 2 * halfBall,
      buttonOpacity = 1;
  if ((canvasWidth - right) < 80) {
    buttonOpacity = 0.5;
    buttonLeft -= 80;
  }
  if ((canvasHeight - bottom) < 46) {
    buttonOpacity = 0.5;
    buttonTop -= 40;
  }
  parent.find('.NooBox-screenshot-search').css({
    top: buttonTop + 'px',
    left: buttonLeft + 'px',
    opacity: buttonOpacity,
  });
  parent.find('.NooBox-screenshot-close').css({
    top: buttonTop + 'px',
    left: (buttonLeft + 37) + 'px',
    opacity: buttonOpacity,
  });
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request == 'loaded') {
      sendResponse('yes');
    }
    if ('job' in request) {
      if (request.job == 'screenshotSearch') {
        chrome.runtime.sendMessage({
          job: 'analytics',
          category: 'screenshotSearch',
          action: 'run'
        }, function(response) {});
        $(document.head).append('<style>#NooBox-screenshot{margin:0px;border:0px;padding:0px;border-radius:0px}#NooBox-screenshot *{transition:none;margin:0px;border:0px;padding:0px;border-radius:0px}</style>');
        var div = $('<div id="NooBox-screenshot" style="width:100%;height:100%;z-index:999999999999999999999;position:fixed;left:0px;top:0px;" ></div>');
        var img = new Image();
        img.src = request.data;
        var defautlCSS = 'margin:0;padding:0;position:absolute;';
        img.onload = function() {
          div.append('<div class="NooBox-screenshot-search" style="' + defautlCSS + 'cursor:pointer;box-sizing:content-box;height:29px;width:29px;position:absolute;z-index:3;float:right;background-color:rgba(130, 186, 255, 0);"><svg viewBox="0 0 300 300" width="300" height="300" xmlns="http://www.w3.org/2000/svg"> <g> <ellipse ry="87" rx="86" id="svg_1" cy="121.999997" cx="123.000003" stroke-width="25" stroke="#2c93e3" fill="#000000" fill-opacity="0"/> <line stroke-linecap="null" stroke-linejoin="null" id="svg_3" y2="267.499998" x2="251.500004" y1="193.5" x1="185.5" stroke-opacity="null" stroke-width="30" stroke="#2c93e3" fill="none"/> </g></svg></div>');
          div.append('<canvas width=' + img.width + ' height=' + img.height + ' style="' + defautlCSS + 'height:100%;width:100%;top:0;left:0;position:absolute" class="NooBox-screenshot-canvas"></canvas>');
          div.append('<div class="NooBox-screenshot-close" style="' + defautlCSS + 'position:absolute;z-index:3;cursor:pointer;user-select: none;width: 29px;height: 29px;font-size: 30px;text-align: center;line-height:0px;background: rgba(193, 22, 59, 0);"><svg viewBox="0 0 300 300" width="300" height="300" xmlns="http://www.w3.org/2000/svg"> <g> <line stroke-linecap="null" stroke="#2c93e3" stroke-linejoin="null" id="svg_3" y2="250" x2="250" y1="50" x1="50" stroke-opacity="null" stroke-width="30" fill="none"/> <line stroke="#2c93e3" transform="rotate(-90 142.00000000000003,148.5) " stroke-linecap="null" stroke-linejoin="null" id="svg_5" y2="250" x2="250" y1="50" x1="50" stroke-opacity="null" stroke-width="30" fill="none"/> </g></svg></div>');
          div.append('<div class="NooBox-screenshot-cursorTopLeft NooBox-shiny" style="' + defautlCSS + 'z-index:3;cursor:crosshair;left:0;top:0;position:absolute;border-radius:50%;width:12px;height:12px"></div>');
          div.append('<div class="NooBox-screenshot-cursorBottomRight NooBox-shiny" style="' + defautlCSS + 'z-index:3;cursor:crosshair;left:0;top:0;position:absolute;border-radius:50%;width:12px;height:12px"></div>');
          div.append('<div class="NooBox-screenshot-cover" style="' + defautlCSS + 'pointer-events:none;position:absolute;left:0;top:0;background-color:rgba(0,0,0,0.418)"></div>');
          $('body').append(div);
          $('body').append('<style>#NooBox-screenshot svg{width: 100%;height: 100%;}@keyframes shiny{0%{background-color:#2c93e3}50%{background-color:black}100%{background-color:#2c93e3}} .NooBox-shiny{animation: shiny 3s infinite}</style>');
          $('.NooBox-screenshot-close').on('click', function(e) {
            $(div).remove();
          });
          var canvasWidth = $(div).find('.NooBox-screenshot-canvas').width();
          var canvasHeight = $(div).find('.NooBox-screenshot-canvas').height();
          $(document).keyup(function (e) {
            if (e.keyCode == 27) {
              $(div).remove();
            }
          });
          $(div).find('.NooBox-screenshot-cursorTopLeft').offset({
            top: (canvasHeight / 3),
            left:(canvasWidth / 3),
          });
          $(div).find('.NooBox-screenshot-cursorBottomRight').offset({
            top: (2 * canvasHeight / 3),
            left:(2 * canvasWidth / 3),
          });
          moveCover(div);
          $('.NooBox-screenshot-cursorTopLeft').on('mousedown', function(e) {
            if (!drag.state) {
              drag.elem = this;
              drag.x = e.pageX;
              drag.y = e.pageY;
              drag.state = true;
            }
          });
          $('.NooBox-screenshot-cursorBottomRight').on('mousedown', function(e) {
            if (!drag.state) {
              drag.elem = this;
              drag.x = e.pageX;
              drag.y = e.pageY;
              drag.state = true;
            }
          });
          $('.NooBox-screenshot-canvas').on('mousedown', function(e) {
            if (!newSelection) {
              newSelection = true;
              var parent = $(e.target).parent();
              parent.find('.NooBox-screenshot-cursorTopLeft').offset({
                top: e.pageY,
                left: e.pageX
              });
              moveCover($(e.target).parent());
            }
          });
          $('.NooBox-screenshot-canvas').on('mouseup', function(e) {
            if (newSelection) {
              newSelection = false;
            }
          });
          $('.NooBox-screenshot-cursorBottomRight').on('mouseup', function(e) {
            if (newSelection) {
              newSelection = false;
            }
          });
          $(document).mousemove(moveCursor);
          $(document).mouseup(function() {
            if (drag.state) {
              drag.state = false;
            }
          });
          $('.NooBox-screenshot-search').on('click', function(e) {
            console.log('searching');
            var left1 = $(e.target).parent().find('.NooBox-screenshot-cursorTopLeft').offset().left;
            var top1 = $(e.target).parent().find('.NooBox-screenshot-cursorTopLeft').offset().top;
            var left2 = $(e.target).parent().find('.NooBox-screenshot-cursorBottomRight').offset().left;
            var top2 = $(e.target).parent().find('.NooBox-screenshot-cursorBottomRight').offset().top;
            var left = Math.min(left1, left2) + halfBall;
            var top = Math.min(top1, top2) + halfBall;
            var width = Math.abs(left1 - left2);
            var height = Math.abs(top1 - top2);
            var canvasTop = $(e.target).parent().find('.NooBox-screenshot-canvas').offset().top;
            var canvasLeft = $(e.target).parent().find('.NooBox-screenshot-canvas').offset().left;
            var ratio = img.height / $(e.target).parent().find('.NooBox-screenshot-canvas').height();
            var imgData = $(e.target).parent().find('.NooBox-screenshot-canvas')[0].getContext('2d').getImageData((left - canvasLeft) * ratio, (top - canvasTop) * ratio, (width) * ratio, (height) * ratio);
            var canvas1 = document.createElement("canvas");
            canvas1.width = (width) * ratio;
            canvas1.height = (height) * ratio;
            var ctx = canvas1.getContext('2d');
            ctx.putImageData(imgData, 0, 0);
            var dataURL = canvas1.toDataURL();
            console.log(dataURL);
            chrome.extension.sendMessage({
              job: 'imageSearch_upload',
              data: dataURL
            });
          });
          setTimeout(loadScreenshot, 300);
        }
        var loadScreenshot = function() {
          var canvas = $('.NooBox-screenshot-canvas').last()[0];
          if (!canvas) {
            setTimeout(loadScreenshot, 300);
          } else {
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
          }
        }
      }
    }
  }
);
