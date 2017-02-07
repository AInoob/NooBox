var vid=null;
var timeStep=5;
var volumeStep=0.05;
var playbackRateStep=0.1;
var detectVideoHandle=null;
var indicatorSize={width:100,height:100};
var conflictCount=[];

function handleVisibilityChange() {
  if (document[hidden]) {
    videoElement.pause();
  } else {
    videoElement.play();
  }
}

function init(){
  console.log('hello');
  buildVideoStates([{event:'play',target:'playPause'},{event:'pause',target:'playPause'},{event:'volumechange',target:'volumeChange'}]);
  $(document.head).append('<style>@keyframes hideAnimation{0% { opacity:0.618;} 100% {opacity:0;}}.hide{animation:hideAnimation ease-in 0.333s forwards;}#NooBox-Video-Indicator-Icon{margin-top:-25px;height:30px;margin-bottom:-5px}#NooBox-Video-Indicator{pointer-events:none;display:none;height:'+indicatorSize.height+'px;width:'+indicatorSize.width+'px;position:absolute;text-align:center;font-size:23px;line-height:'+indicatorSize.height+'px;opacity:0.618;background-color:rgb(43,54,125);color:white;z-index:99999999999999;margin:0;padding:0;border:0}</style>');
  $('body').append('<div id="NooBox-Video-Indicator"></div>');
  detectVideoHandle=setInterval(detectVideo,111);
  $('body').on('click',function(e){
    vid=getVideo(e);
    if(vid){
      detectConflictAndAct(playPause,'playPause','clickPlayPause',111);
    }
  });
}

function displayIndicator(text,icon){
  if(!icon){
    icon='';
  }
  $('#NooBox-Video-Indicator').removeClass('hide');
  console.log('display');
  setTimeout(function(){
    $('#NooBox-Video-Indicator').addClass('hide');
    console.log('hide');
  },100);
  $('#NooBox-Video-Indicator').html('<div id="NooBox-Video-Indicator-Icon">'+icon+'</div>'+text);
}

function detectConflictAndAct(actFunction,actionId,conflictId,detectTimeout){
  placeIndicator();
  var index=getIndex(vid);
  if(!index){
    return;
  }
  var conflictClass='NooBox-Video-Conflict-'+conflictId;
  if(!$(vid).hasClass(conflictClass)){
    actFunction();
    conflictCount[index][actionId]--;
    setTimeout(function(){
      if(conflictCount[index][actionId]>0){
        $(vid).addClass(conflictClass);
        actFunction();
        console.log(conflictCount[index]);
        setTimeout(function(){
          conflictCount[index][actionId]=0;
        },50);
      }
    },50);
  }
  else{
    setTimeout(function(){
      if(conflictCount[index][actionId]==0){
        $(vid).removeClass(conflictClass);
        actFunction();
        conflictCount[index][actionId]--;
      }
    },111);
  }
}

function playPause(){
  if(vid.paused){
    vid.play();
    displayIndicator('Play');
  }
  else{
    vid.pause();
    displayIndicator('Pause');
  }
}

function rewind(step){
  vid.currentTime-=step;
  displayIndicator(step+'s','&larr;');
}

function forward(step){
  vid.currentTime+=step;
  displayIndicator(step+'s','&rarr;');
}

function goTo(i){
  vid.currentTime=vid.duration*i/10;
  displayIndicator((i*10)+'%','&commat;');
}

function volumeUp(step){
  if(vid.volume.toFixed(2)<=1-step){
    vid.volume=(vid.volume+step).toFixed(2);
    displayIndicator(vid.volume+'%','&uarr;');
  }
}

function volumeDown(step){
  if(vid.volume.toFixed(2)>=step){
    vid.volume=(vid.volume-step).toFixed(2);
    displayIndicator(vid.volume+'%','&darr;');
  }
}

function speedUp(step){
  if(vid.playbackRate.toFixed(2)<=16-step){
    vid.playbackRate=(vid.playbackRate+step).toFixed(2);
    displayIndicator(vid.playbackRate,'&raquo;');
  }
}

function slowDown(step){
  if(vid.playbackRate.toFixed(2)>=step+0.0625){
    vid.playbackRate=(vid.playbackRate-step).toFixed(2);
    displayIndicator(vid.playbackRate,'&laquo;');
  }
}

function rotate(step){
  var vv=$(vid);
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

function mute(){
  vid.muted=!vid.muted;
  if(vid.muted){
    displayIndicator('<span style="font-size:48px;text-decoration:line-through;">&sung;</span>');
  }
  else{
    displayIndicator('<span style="font-size:48px;">&sung;</span>');
  }
}

function toggleFullscreen(){
  conflictCount.fullscreen--;
  if(document.webkitFullscreenElement===vid){
    document.webkitExitFullscreen();
  }
  else{
    vid.webkitRequestFullScreen();
  }
}

function download(){
  var link = document.createElement("a");
  link.href = vid.currentSrc;
  link.download = 'video';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

//check if any video is in the cursor range
//if not, check which video change it's playing state
function getVideo(e){
  var v=e.target;
  if($(v).is('video')){
    return v;
  }
  v=null;
  var videoList=$('video');
  var pos;
  var x=e.pageX;
  var y=e.pageY;
  for(var i=0;i<videoList.length;i++){
    pos=$(videoList[i]).offset();
    if(!(x<pos.left||y<pos.top||x>pos.left+$(videoList[i]).width()||y>pos.top+$(videoList[i]).height())){
      v=videoList[i];
      break;
    }
  }
  return v;
}

//get the first video if no video is found
function detectVideo(){
  if(vid==null){
    vid=$('video')[0];
  }
}

function getIndex(v){
  var className=$(v).attr('class')||'';
  var index=(className.match(/NooBox-Video-(\d+)/)||[null,null])[1];
  return index;
}

function buildVideoStates(listenerList){
  var videoList=$('video');
  for(var i=0;i<videoList.length;i++){
    var v=videoList[i];
    var index=getIndex(v);
    if(index==null){
      conflictCount.push({playPause:0,volumeChange:0});
      var newIndex=conflictCount.length-1;
      $(v).addClass('NooBox-Video-'+(newIndex));
      for(var j=0;j<listenerList.length;j++){
        var listener=listenerList[j];
        console.log(listener);
        $(v).on(listener.event,incCounter.bind(null,newIndex,listener.target));
      }
    }
  }
}

function incCounter(index,target){
  conflictCount[index][target]++;
  console.log(conflictCount);
}

function placeIndicator(){
  if(vid){
    var newPos=$(vid).offset();
    newPos.left+=($(vid).width()-indicatorSize.width)/2;
    newPos.top+=($(vid).height()-indicatorSize.height)/2;
    $('#NooBox-Video-Indicator').offset(newPos);
    $('#NooBox-Video-Indicator').show();
    $('#NooBox-Video-Indicator').addClass('hide');
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
