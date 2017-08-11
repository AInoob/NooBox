let vid = null;
const timeStep = 5;
const volumeStep = 0.05;
const playbackRateStep = 0.05;
let fps = 30;
let detectVideoHandle = null;
let detectVideoTime = new Date().getTime();
const indicatorSize = {
  width: 100,
  height: 100
};
const conflictCount = [];
let canvas;
let ctx;
let beyondId = -1;
let enabled = false;
let enabledDBId = '';
let inited = false;

function handleVisibilityChange() {
  if (document[hidden]) {
    videoElement.pause();
  } else {
    videoElement.play();
  }
}

function getDB(key) {
  chrome.runtime.sendMessage({
    job: 'getDB',
    key: key
  });
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ('job' in request) {
      if (request.job == 'videoConrolContentScriptSwitch') {
        enabled = request.enabled;
        if (enabled != false) {
          enabled = true;
          init();
        }
      } else if (request.job == 'returnDB') {
        if (request.key == enabledDBId) {
          enabled = request.data;
          if (enabled != false) {
            enabled = true;
            init();
          }
        }
      }
    }
  });

function init() {
  if (inited) {
    return;
  }
  inited = true;
  $('body').append('<canvas id="NooBox-VideoBeyond-preCanvas" style="display: none"></canvas>');
  canvas = $('#NooBox-VideoBeyond-preCanvas')[0];
  ctx = canvas.getContext('2d');
  buildVideoStates([{
    event: 'play',
    target: 'playPause'
  }, {
    event: 'pause',
    target: 'playPause'
  }, {
    event: 'volumechange',
    target: 'volumeChange'
  }]);
  $(document.head).append('<style>@-webkit-keyframes hideAnimation2{0% { opacity:0.618;} 100% {opacity:0;}}@keyframes hideAnimation{0% { opacity:0.618;} 100% {opacity:0;}}.noobox-hide{-webkit-animation:hideAnimation2 ease-in 0.333s forwards;animation:hideAnimation ease-in 0.333s forwards;}#NooBox-Video-Indicator-Icon{margin-top:-25px;height:30px;margin-bottom:-5px}#NooBox-Video-Indicator{pointer-events:none;display:none;height:' + indicatorSize.height + 'px;width:' + indicatorSize.width + 'px;position:absolute;text-align:center;font-size:23px;line-height:' + indicatorSize.height + 'px;opacity:0.618;background-color:rgb(43,54,125);color:white;z-index:99999999999999;margin:0;padding:0;border:0}</style>');
  $('body').append('<div id="NooBox-Video-Indicator"></div>');
  detectVideoHandle = setInterval(detectVideo, 111);
  $('body').on('click', function(e) {
    vid = getVideo(e);
    if (enabled && vid) {
      placeIndicator();
      detectConflictAndAct(playPause, vid, 'playPause', 'clickPlayPause', 111);
    }
  });
  $('body').on('dblclick', function(e) {
    placeIndicator();
    vid = getVideo(e);
    if (enabled && vid) {}
  });
  document.onkeydown = function(e) {
    e = e || window.event;
    if (enabled && vid) {
      const k = e.keyCode;
      if (k == '38' || k == '40' || k == '37' || k == '39' || k == '36' || k == '35') {
        chrome.runtime.sendMessage({
          job: 'videoControl_use'
        });
      }
      placeIndicator();
      if (e.keyCode == '38') {
        detectConflictAndAct(volumeUp, vid, 'volumeChange', 'arrowUpVolumeChange', 111);
      } else if (e.keyCode == '40') {
        detectConflictAndAct(volumeDown, vid, 'volumeChange', 'arrowDownVolumeChange', 111);
      } else if (e.keyCode == '37') {
        detectConflictAndAct(rewindSmall, vid, 'timeChange', 'rewindSmall', 111);
      } else if (e.keyCode == '39') {
        detectConflictAndAct(forwardSmall, vid, 'timeChange', 'forwardSmall', 111);
      } else if (e.keyCode == '36') {
        goTo(vid, 0);
      } else if (e.keyCode == '35') {
        goTo(vid, 10);
      }
    }
  };
  $(document).on('keypress', function(e) {
    if (enabled && vid) {
      placeIndicator();
      e.preventDefault();
      const k = String.fromCharCode(e.which);
      if (k == 'k' || k == ' ' || k == 'j' || k == 'l' || k == ',' || k == '.' || k == '<' || k == '>' || k == 'r' || k == 'm' || k == 'f' || k == 'd' || k == 'b') {
        chrome.runtime.sendMessage({
          job: 'videoControl_use'
        });
      }
      switch (k) {
        case 'k':
          detectConflictAndAct(playPause, vid, 'playPause', 'kPlayPause', 111);
          break;
        case ' ':
          detectConflictAndAct(playPause, vid, 'playPause', 'spacePlayPause', 111);
          break;
        case 'j':
          detectConflictAndAct(rewindBig, vid, 'timeChange', 'rewindBig', 111);
          break;
        case 'l':
          detectConflictAndAct(forwardBig, vid, 'timeChange', 'forwardBig', 111);
          break;
        case ',':
          detectConflictAndAct(rewindTiny, vid, 'timeChange', 'rewindTiny', 111);
          break;
        case '.':
          detectConflictAndAct(forwardTiny, vid, 'timeChange', 'forwardTiny', 111);
          break;
        case '<':
          detectConflictAndAct(slowDown, vid, 'rateChange', 'slowRateChange', 111);
          break;
        case '>':
          detectConflictAndAct(speedUp, vid, 'rateChange', 'speedRateChange', 111);
          break;
        case 'r':
          rotate(vid, 90);
          break;
        case 'm':
          detectConflictAndAct(mute, vid, 'volumeChange', 'muteVolumeChange', 111);
          break;
        case 'f':
          toggleFullscreen(vid);
          break;
        case 'd':
          download(vid);
          break;
        case 'b':
          //beyond(vid);
          break;
        default:
          if (e.which >= 48 && e.which <= 57) {
            goTo(vid, e.which - 48);
          }
      }
    }
  });
}

function displayIndicator(text, icon) {
  if (!icon) {
    icon = '';
  }
  $('#NooBox-Video-Indicator').removeClass('noobox-hide');
  setTimeout(function() {
    $('#NooBox-Video-Indicator').addClass('noobox-hide');
  }, 100);
  $('#NooBox-Video-Indicator').html('<div id="NooBox-Video-Indicator-Icon">' + icon + '</div>' + text);
}

function detectConflictAndAct(actFunction, v, actionId, conflictId, detectTimeout) {
  placeIndicator();
  const index = getIndex(vid);
  if (!index) {
    buildVideoStates([{
      event: 'play',
      target: 'playPause'
    }, {
      event: 'pause',
      target: 'playPause'
    }, {
      event: 'volumechange',
      target: 'volumeChange'
    }, {
      event: 'timeupdate',
      target: 'timeUpdate'
    }, {
      event: 'ratechange',
      target: 'rateChange'
    }, {
		}]);
    detectConflictAndAct(actFunction, v, actionId, conflictId, detectTimeout);
    return;
  }
  const conflictClass = 'NooBox-Video-Conflict-' + conflictId;
  if (!$(vid).hasClass(conflictClass)) {
    actFunction(v);
    conflictCount[index][actionId]--;
    setTimeout(function() {
      if (conflictCount[index][actionId] > 0) {
        $(vid).addClass(conflictClass);
        actFunction(v);
        conflictCount[index][actionId]--;
        setTimeout(function() {
          conflictCount[index][actionId] = 0;
        }, 111);
      }
    }, 222);
  } else {
    conflictCount[index][actionId]--;
    setTimeout(function() {
      if (conflictCount[index][actionId] < 0) {
        $(vid).removeClass(conflictClass);
        actFunction(v);
      }
    }, 222);
  }
}

function playPause(v) {
  if (v.paused) {
    v.play();
    displayIndicator('Play');
  } else {
    v.pause();
    displayIndicator('Pause');
  }
}

function beyond(v) {
  if (beyondId == -1) {
    beyondId = setInterval(function() {
      const prev = new Date().getTime();
      let temp = new Date().getTime();
      ctx.drawImage(v, 0, 0, $(v).width(), $(v).height());
      temp = new Date().getTime();
      const dataURI = canvas.toDataURL("image/png");
      temp = new Date().getTime();
      chrome.runtime.sendMessage({
        job: 'passToFront',
        message: {
          job: 'videoBeyond',
          dataURI: dataURI,
          prev: prev
        }
      });
      temp = new Date().getTime();
    }, 200);
  } else {
    clearInterval(beyondId);
    beyondId = -1;
  }
}


function rewind(v, step) {
  v.currentTime -= step;
  displayIndicator(step + 's', '&larr;');
}

function rewindSmall(v) {
  rewind(v, timeStep);
}

function rewindBig(v) {
  rewind(v, timeStep * 2);
}

function rewindTiny(v) {
  rewind(v, 1 / fps);
}

function forward(v, step) {
  v.currentTime += step;
  displayIndicator(step + 's', '&rarr;');
}

function forwardSmall(v) {
  forward(v, timeStep);
}

function forwardBig(v) {
  forward(v, timeStep * 2);
}

function forwardTiny(v) {
  forward(v, 1 / fps);
}

function goTo(v, i) {
  v.currentTime = v.duration * i / 10;
  displayIndicator((i * 10) + '%', '&commat;');
}

function volumeUp(v) {
  if (v.volume.toFixed(2) <= 1 - volumeStep) {
    v.volume = (v.volume + volumeStep).toFixed(2);
    displayIndicator(v.volume + '%', '&uarr;');
  }
}

function volumeDown(v) {
  if (v.volume.toFixed(2) >= volumeStep) {
    v.volume = (v.volume - volumeStep).toFixed(2);
    displayIndicator(v.volume + '%', '&darr;');
  }
}

function speedUp(v) {
	const step = playbackRateStep;
  if (v.playbackRate.toFixed(2) <= 16 - step) {
    v.playbackRate = (v.playbackRate + step).toFixed(2);
    displayIndicator(v.playbackRate, '&raquo;');
  }
}

function slowDown(v) {
	const step = playbackRateStep;
  if (v.playbackRate.toFixed(2) >= step + 0.0625) {
    v.playbackRate = (v.playbackRate - step).toFixed(2);
    displayIndicator(v.playbackRate, '&laquo;');
  }
}

function rotate(v, step) {
  const vv = $(v);
  const matrix = vv.css('transform') || vv.css('-webkit-transform');
  let deg;
  if (matrix !== 'none') {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = values[0];
    const b = values[1];
    deg = Math.round(Math.atan2(b, a) * (180 / Math.PI));
  } else {
    deg = 0;
  }
  deg = (deg + step) % 360;
  vv.css('transform', 'rotate(' + deg + 'deg)');
  vv.css('-webkit-transform', 'rotate(' + deg + 'deg)');
}

function mute(v) {
  v.muted = !v.muted;
  if (v.muted) {
    displayIndicator('<span style="font-size:48px;text-decoration:line-through;">&sung;</span>');
  } else {
    displayIndicator('<span style="font-size:48px;">&sung;</span>');
  }
}

function toggleFullscreen(v) {
  conflictCount.fullscreen--;
  if (document.webkitFullscreenElement === v) {
    document.webkitExitFullscreen();
  } else {
    v.webkitRequestFullScreen();
  }
}

function download(v) {
  const link = document.createElement("a");
  link.href = v.currentSrc;
  link.download = 'video';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//check if any video is in the cursor range
//if not, check which video change it's playing state
function getVideo(e) {
  let v = e.target;
  if ($(v).is('video')) {
    return v;
  }
  v = null;
  const videoList = $('video');
  let pos;
  const x = e.pageX;
  const y = e.pageY;
  for (let i = 0; i < videoList.length; i++) {
    pos = $(videoList[i]).offset();
    if (!(x < pos.left || y < pos.top || x > pos.left + $(videoList[i]).width() || y > pos.top + $(videoList[i]).height())) {
      v = videoList[i];
      break;
    }
  }
  return v;
}

//get the first video if no video is found
function detectVideo() {
  if (!vid) {
    vid = $('video')[0];
    if (detectVideoTime + 1000 < new Date().getTime()) {
      clearInterval(detectVideoHandle);
    }
  } else {
    clearInterval(detectVideoHandle);
  }
}

function getIndex(v) {
  const className = $(v).attr('class') || '';
  const index = (className.match(/NooBox-Video-(\d+)/) || [null, null])[1];
  return index;
}

function buildVideoStates(listenerList) {
  const videoList = $('video');
  for (let i = 0; i < videoList.length; i++) {
    const v = videoList[i];
    const index = getIndex(v);
    if (index == null) {
      conflictCount.push({
        playPause: 0,
        volumeChange: 0
      });
      const newIndex = conflictCount.length - 1;
      $(v).addClass('NooBox-Video-' + (newIndex));
      for (let j = 0; j < listenerList.length; j++) {
        const listener = listenerList[j];
        $(v).on(listener.event, incCounter.bind(null, newIndex, listener.target));
      }
    }
  }
}

function incCounter(index, target) {
  conflictCount[index][target]++;
}

function placeIndicator() {
  if (vid) {
    const newPos = $(vid).offset();
    newPos.left += ($(vid).width() - indicatorSize.width) / 2;
    newPos.top += ($(vid).height() - indicatorSize.height) / 2;
    $('#NooBox-Video-Indicator').offset(newPos);
    $('#NooBox-Video-Indicator').show();
    $('#NooBox-Video-Indicator').addClass('noobox-hide');
  }
}

document.addEventListener("DOMContentLoaded", function() {
  isOn('videoControl', function() {
    const host = window.location.hostname;
    enabledDBId = 'videoControl_website_' + host;
    getDB(enabledDBId);
  });
});

function get(key, callback) {
  chrome.storage.sync.get(key, function(result) {
    if (callback)
      callback(result[key]);
  });
}

function isOn(key, callbackTrue, callbackFalse, param) {
  get(key, function(value) {
    if (value == '1' || value == true) {
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
