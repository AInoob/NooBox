var vid=null;
var timeStep=5;
var volumeStep=0.05;
var playbackRateStep=0.05;
var detectVideoHandle=null;
var indicatorSize={width:100,height:100};
var conflictCount=[];
var canvas;
var ctx;
var beyondId=-1;
var enabled=false;
var enabledDBId='';
var inited=false;

function handleVisibilityChange() {
  if (document[hidden]) {
    videoElement.pause();
  } else {
    videoElement.play();
  }
}

function getDB(key){
  chrome.runtime.sendMessage({job:'getDB',key:key,function(data){
  }});
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if('job' in request){
      if(request.job=='videoConrolContentScriptSwitch'){
        enabled=request.enabled;
        if(enabled!=false){
          init();
        }
      }
      else if(request.job=='returnDB'){
        if(request.key==enabledDBId){
          enabled=request.data;
          if(enabled!=false){
            init();
          }
        }
      }
    }
  });
function init(){
  if(inited){
    return;
  }
  inited=true;
  $('body').append('<canvas id="NooBox-VideoBeyond-preCanvas" style="display: none"></canvas>');
  canvas=$('#NooBox-VideoBeyond-preCanvas')[0];
  ctx=canvas.getContext('2d');
  buildVideoStates([{event:'play',target:'playPause'},{event:'pause',target:'playPause'},{event:'volumechange',target:'volumeChange'}]);
  $(document.head).append('<style>@keyframes hideAnimation{0% { opacity:0.618;} 100% {opacity:0;}}.noobox-hide{animation:hideAnimation ease-in 0.333s forwards;}#NooBox-Video-Indicator-Icon{margin-top:-25px;height:30px;margin-bottom:-5px}#NooBox-Video-Indicator{pointer-events:none;display:none;height:'+indicatorSize.height+'px;width:'+indicatorSize.width+'px;position:absolute;text-align:center;font-size:23px;line-height:'+indicatorSize.height+'px;opacity:0.618;background-color:rgb(43,54,125);color:white;z-index:99999999999999;margin:0;padding:0;border:0}</style>');
  $('body').append('<div id="NooBox-Video-Indicator"></div>');
  detectVideoHandle=setInterval(detectVideo,111);
  $('body').on('click',function(e){
    vid=getVideo(e);
    if(enabled&&vid){
      placeIndicator();
      detectConflictAndAct(playPause,vid,'playPause','clickPlayPause',111);
    }
  });
  $('body').on('dblclick',function(e){
    placeIndicator();
    vid=getVideo(e);
    if(enabled&&vid){
    }
  });
  document.onkeydown = function(e){
    e=e||window.event;
    if(enabled&&vid){
      placeIndicator();
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
    if(enabled&&vid){
      placeIndicator();
      e.preventDefault();
      switch(String.fromCharCode(e.which)){
        case 'k':
          detectConflictAndAct(playPause,vid,'playPause','kPlayPause',111);
          break;
        case ' ':
          detectConflictAndAct(playPause,vid,'playPause','spacePlayPause',111);
          break;
        case 'j':
          rewind(vid,timeStep*2);
          break;
        case 'l':
          forward(vid,timeStep*2);
          break;
        case ',':
          rewind(vid,1/30);
          break;
        case '.':
          forward(vid,1/30);
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
        case 'b':
          //beyond(vid);
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
  $('#NooBox-Video-Indicator').removeClass('noobox-hide');
  setTimeout(function(){
    $('#NooBox-Video-Indicator').addClass('noobox-hide');
  },100);
  $('#NooBox-Video-Indicator').html('<div id="NooBox-Video-Indicator-Icon">'+icon+'</div>'+text);
}

function detectConflictAndAct(actFunction,v,actionId,conflictId,detectTimeout){
  placeIndicator();
  var index=getIndex(vid);
  if(!index){
    buildVideoStates([{event:'play',target:'playPause'},{event:'pause',target:'playPause'},{event:'volumechange',target:'volumeChange'}]);
    detectConflictAndAct(actFunction,v,actionId,conflictId,detectTimeout);
    return;
  }
  var conflictClass='NooBox-Video-Conflict-'+conflictId;
  if(!$(vid).hasClass(conflictClass)){
    actFunction(v);
    conflictCount[index][actionId]--;
    setTimeout(function(){
      if(conflictCount[index][actionId]>0){
        $(vid).addClass(conflictClass);
        actFunction(v);
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
        actFunction(v);
        conflictCount[index][actionId]--;
      }
    },111);
  }
}

function playPause(v){
  if(v.paused){
    v.play();
    displayIndicator('Play');
  }
  else{
    v.pause();
    displayIndicator('Pause');
  }
}

function beyond(v){
  if(beyondId==-1){
    beyondId=setInterval(function(){
      var prev=new Date().getTime();
      var temp=new Date().getTime();
      ctx.drawImage(v, 0, 0, $(v).width(), $(v).height());
      temp=new Date().getTime();
      var dataURI=canvas.toDataURL("image/png");
      temp=new Date().getTime();
      chrome.runtime.sendMessage({job:'passToFront',message:{job:'videoBeyond',dataURI:dataURI,prev:prev}});
      temp=new Date().getTime();
    },200);
  }
  else{
    clearInterval(beyondId);
    beyondId=-1;
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
  conflictCount.fullscreen--;
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
        $(v).on(listener.event,incCounter.bind(null,newIndex,listener.target));
      }
    }
  }
}

function incCounter(index,target){
  conflictCount[index][target]++;
}

function placeIndicator(){
  if(vid){
    var newPos=$(vid).offset();
    newPos.left+=($(vid).width()-indicatorSize.width)/2;
    newPos.top+=($(vid).height()-indicatorSize.height)/2;
    $('#NooBox-Video-Indicator').offset(newPos);
    $('#NooBox-Video-Indicator').show();
    $('#NooBox-Video-Indicator').addClass('noobox-hide');
  }
}

document.addEventListener("DOMContentLoaded", function(){
  isOn('videoControl',function(){
    var host=window.location.hostname;
    enabledDBId='videoControl_website_'+host;
    getDB(enabledDBId);
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
