var vid=null;
var timeStep=5;
var volumeStep=0.05;
var playbackRateStep=0.1;
var detectVideoHandle=null;
var videoStates=[];
var indicatorSize={width:100,height:100};
var videoPaused=true;
var conflictCounter={play:0,fullscreen:0};

function handleVisibilityChange() {
  if (document[hidden]) {
    videoElement.pause();
  } else {
    videoElement.play();
  }
}

function init(){
  $(document.head).append('<style>@keyframes hideAnimation{0% { opacity:0.618;} 100% {opacity:0;}}.hide{animation:hideAnimation ease-in 0.333s forwards;}#NooBox-Video-Indicator-Icon{margin-top:-25px;height:30px;margin-bottom:-5px}#NooBox-Video-Indicator{pointer-events:none;display:none;height:'+indicatorSize.height+'px;width:'+indicatorSize.width+'px;position:absolute;text-align:center;font-size:23px;line-height:'+indicatorSize.height+'px;opacity:0.618;background-color:rgb(43,54,125);color:white;z-index:99999999999999;margin:0;padding:0;border:0}</style>');
  $('body').append('<div id="NooBox-Video-Indicator"></div>');
  detectVideoHandle=setInterval(detectVideo,111);
  $('body').on('click',function(e){
    var v=e.target;
    if($(v).is('video')){
      vid=v;
    }
    else{
      vid=getVideo(e.pageX,e.pageY);
    }
    if(vid){
      videoPaused=vid.paused;
      placeIndicator();
      $(vid).off('play');
      $(vid).off('pause');
      $(vid).on('play',function(){conflictCounter.play++});
      $(vid).on('pause',function(){conflictCounter.play++});
      $(document).off('webkitfullscreenchange fullscreenchange');
      $(document).on('webkitfullscreenchange fullscreenchange',function(){if((document.fullscreenElement||document.webkitFullscreenElement)==vid){conflictCounter.fullscreen++}});
      if($(vid).hasClass('NooBox-Video-Conflict-ClickPlay')){
      }
      else if($(vid).hasClass('NooBox-Video-NoConflict-ClickPlay')){
        playPause(vid);
        setTimeout(function(){
          if(conflictCounter.play>0){
            $(vid).removeClass('NooBox-Video-NoConflict-ClickPlay');
            $(vid).addClass('NooBox-Video-Conflict-ClickPlay');
            playPause(vid);
          }
        },111);
      }
      else{
        setTimeout(function(){
          var tempV=getStateChangedVideo();
          if(tempV==vid){
            $(vid).removeClass('NooBox-Video-NoConflict-ClickPlay');
            $(vid).addClass('NooBox-Video-Conflict-ClickPlay');
          }
          else{
            $(vid).removeClass('NooBox-Video-Conflict-ClickPlay');
            $(vid).addClass('NooBox-Video-NoConflict-ClickPlay');
            playPause(vid);
          }
        },111);
      }
    }
    buildVideoStates();
  });
  $('body').on('dblclick',function(e){
    var v=e.target;
    if($(v).is('video')){
      vid=v;
    }
    else{
      vid=getVideo(e.pageX,e.pageY);
    }
    if(vid){
      if($(vid).hasClass('NooBox-Video-Conflict-Fullscreen')){
        return;
      }
      toggleFullscreen(vid);
      setTimeout(function(){
        if(conflictCounter.fullscreen>0){
          $(vid).addClass('NooBox-Video-Conflict-Fullscreen');
          toggleFullscreen(vid);
        }
      },50);
      placeIndicator();
    }
  });
  document.onkeydown = function(e){
    e=e||window.event;
    if(vid){
      if (e.keyCode == '38'){
        volumeUp(vid,volumeStep);
      }
      else if(e.keyCode == '40'){
        volumeDown(vid,volumeStep);
      }
      else if(e.keyCode == '37'){
        rewind(vid,timeStep);
      }
      else if(e.keyCode == '39'){
        forward(vid,timeStep);
      }
      else if(e.keyCode == '36'){
        goTo(vid,0);
      }
      else if(e.keyCode == '35'){
        goTo(vid,10);
      }
    }
  };
  $(document).on('keypress',function(e) {
    if(vid){
      placeIndicator();
      e.preventDefault();
      switch(String.fromCharCode(e.which)){
        case 'k':
          $(vid).off('play');
          $(vid).off('pause');
          if($(vid).hasClass('NooBox-Video-Conflict-PressPlay')){
          }
          else if($(vid).hasClass('NooBox-Video-NoConflict-PressPlay')){
            playPause(vid);
            setTimeout(function(){
              console.log(conflictCounter.play);
              if(conflictCounter.play>0){
                $(vid).removeClass('NooBox-Video-NoConflict-PressPlay');
                $(vid).addClass('NooBox-Video-Conflict-PressPlay');
                playPause(vid);
              }
            },111);
          }
          else{
            setTimeout(function(){
              var tempV=getStateChangedVideo();
              console.log('check k confliction');
              if(tempV==vid){
                console.log('conflict');
                $(vid).removeClass('NooBox-Video-NoConflict-PressPlay');
                $(vid).addClass('NooBox-Video-Conflict-PressPlay');
              }
              else{
                console.log('not conflict');
                $(vid).removeClass('NooBox-Video-Conflict-PressPlay');
                $(vid).addClass('NooBox-Video-NoConflict-PressPlay');
                playPause(vid);
              }
            },111);
          }
          buildVideoStates();
          break;
        case ' ':
          if(!$(vid).hasClass('NooBox-Video-Conflict-PressPlay')){
            playPause(vid);
          }
          break;
        case 'j':
          rewind(vid,timeStep*2);
          break;
        case 'l':
          forward(vid,timeStep*2);
          break;
        case '<':
          slowDown(vid,playbackRateStep);
          break;
        case '>':
          speedUp(vid,playbackRateStep);
          break;
        case 'r':
          rotate(vid,90);
          break;
        case 'm':
          mute(vid);
          break;
        case 'f':
          toggleFullscreen(vid);
          break;
        case 'd':
          download(vid);
          break;
        default:
          if(e.which>=48&&e.which<=57){
            goTo(vid,e.which-48);
          }
      }
    }
  });
}

function displayIndicator(text,icon){
  if(!icon){
    icon='';
  }
  $('#NooBox-Video-Indicator').removeClass('hide');
  setTimeout(function(){
    $('#NooBox-Video-Indicator').addClass('hide');
  },100);
  $('#NooBox-Video-Indicator').html('<div id="NooBox-Video-Indicator-Icon">'+icon+'</div>'+text);
}

function playPause(v){
  conflictCounter.play--;
  if(v.paused){
    v.play();
    displayIndicator('Play');
  }
  else{
    v.pause();
    displayIndicator('Pause');
  }
}

function rewind(v,step){
  v.currentTime-=step;
  displayIndicator(step+'s','&larr;');
}

function forward(v,step){
  v.currentTime+=step;
  displayIndicator(step+'s','&rarr;');
}

function goTo(v,i){
  v.currentTime=v.duration*i/10;
  displayIndicator((i*10)+'%','&commat;');
}

function volumeUp(v,step){
  if(v.volume.toFixed(2)<=1-step){
    v.volume=(v.volume+step).toFixed(2);
    displayIndicator(v.volume+'%','&uarr;');
  }
}

function volumeDown(v,step){
  if(v.volume.toFixed(2)>=step){
    v.volume=(v.volume-step).toFixed(2);
    displayIndicator(v.volume+'%','&darr;');
  }
}

function speedUp(v,step){
  if(v.playbackRate.toFixed(2)<=16-step){
    v.playbackRate=(v.playbackRate+step).toFixed(2);
    displayIndicator(v.playbackRate,'&raquo;');
  }
}

function slowDown(v,step){
  if(v.playbackRate.toFixed(2)>=step+0.0625){
    v.playbackRate=(v.playbackRate-step).toFixed(2);
    displayIndicator(v.playbackRate,'&laquo;');
  }
}

function rotate(v,step){
  var vv=$(v);
  var matrix=vv.css('transform')||vv.css('-webkit-transform');
  var deg;
  if(matrix !== 'none') {
    var values=matrix.split('(')[1].split(')')[0].split(',');
    var a=values[0];
    var b=values[1];
    deg=Math.round(Math.atan2(b, a) * (180/Math.PI));
  }
  else{
    deg=0;
  }
  deg = (deg+step)%360;
  vv.css('transform','rotate('+deg+'deg)');
  vv.css('-webkit-transform','rotate('+deg+'deg)');
}

function mute(v){
  v.muted=!v.muted;
  if(v.muted){
    displayIndicator('<span style="font-size:48px;text-decoration:line-through;">&sung;</span>');
  }
  else{
    displayIndicator('<span style="font-size:48px;">&sung;</span>');
  }
}

function toggleFullscreen(v){
  conflictCounter.fullscreen--;
  if(document.webkitFullscreenElement===v){
    document.webkitExitFullscreen();
  }
  else{
    v.webkitRequestFullScreen();
  }
}

function download(v){
  var link = document.createElement("a");
  link.href = v.currentSrc;
  link.download = 'video';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

//check if any video is in the cursor range
//if not, check which video change it's playing state
function getVideo(x,y){
  var v=null;
  var videoList=$('video');
  var pos;
  for(var i=0;i<videoList.length;i++){
    pos=$(videoList[i]).offset();
    if(!(x<pos.left||y<pos.top||x>pos.left+$(videoList[i]).width()||y>pos.top+$(videoList[i]).height())){
      v=videoList[i];
      break;
    }
  }
  if(v==null){
    v=getStateChangedVideo();
  }
  return v;
}

//get the first video if no video is found
function detectVideo(){
  if(vid==null){
    vid=$('video')[0];
  }
  else{
    window.clearInterval(detectVideoHandle);
    buildVideoStates();
  }
}

function buildVideoStates(){
  var videoList=$('video');
  for(var i=0;i<videoList.length;i++){
    var className=$(videoList[i]).attr('class')||'';
    var index=(className.match(/NooBox-Video-(\d+)/)||[null,null])[1];
    if(index!=null){
      videoStates[index]=videoList[i].paused;
    }
    else{
      videoStates.push(videoList[i].paused);
      $(videoList[i]).addClass('NooBox-Video-'+(videoStates.length-1));
    }
  }
}

function getStateChangedVideo(){
  var v=null;
  var videoList=$('video');
  for(var i=0;i<videoList.length;i++){
    var className=$(videoList[i]).attr('class');
    var index=(className.match(/NooBox-Video-(\d+)/)||[null,null])[1];
    if(index!=null){
      if(videoList[i].paused!=videoStates[index]){
        v=videoList[i];
      }
    }
  }
  if(v){
  }
  return v;
}

function placeIndicator(){
  if(vid){
    var newPos=$(vid).offset();
    newPos.left+=($(vid).width()-indicatorSize.width)/2;
    newPos.top+=($(vid).height()-indicatorSize.height)/2;
    $('#NooBox-Video-Indicator').offset(newPos);
    $('#NooBox-Video-Indicator').show();
  }
}

document.addEventListener("DOMContentLoaded", function(){
  isOn('videoControl',function(){
    init();
  });
});

function get(key,callback){
  chrome.storage.sync.get(key,function(result){
    if(callback)
      callback(result[key]);
  });
}

function isOn(key,callbackTrue,callbackFalse,param){
  get(key,function(value){
    if(value=='1'||value==true){
      if(callbackTrue){
        callbackTrue(param);
      }
    }
    else{
      if(callbackFalse){
        callbackFalse(param);
      }
    }
  });
}
