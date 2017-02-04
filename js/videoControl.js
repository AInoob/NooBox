function get(key,callback){
  chrome.storage.sync.get(key,function(result){
    if(callback)
      callback(result[key]);
  });
}

var vid=null;
var timeStep=5;
var volumeStep=0.05;
var playbackRateStep=0.1;

function init(){
  $('body').on('click',function(e){
    var v=e.target;
    if($(v).is('video')){
      vid=v;
      playPause(vid);
    }
    else{
      vid=getVideo(e.pageX,e.pageY);
      vid=$('video')[0];
      console.log($(vid).position());
      var pos=$($(vid).position());
      if(e.pageX<pos.left||e.pageY<pos.top||e.pageX>pos.left+$(vid).width()||e.pageY>pos.top+$(vid).height()){
        vid=null;
      }
    }
  });
  $('body').on('dblclick',function(e){
    var v=e.target;
    if($(v).is('video')){
      vid=v;
      toggleFullscreen(vid);
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
      e.preventDefault();
      switch(String.fromCharCode(e.which)){
        case 'k':
          playPause(vid);
          break;
        case ' ':
          playPause(vid);
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

function playPause(v){
  if(v.paused){
    v.play();
  }
  else{
    v.pause();
  }
}

function rewind(v,step){
  v.currentTime-=step;
}

function forward(v,step){
  v.currentTime+=step;
}

function goTo(v,i){
  v.currentTime=v.duration*i/10;
}

function volumeUp(v,step){
  if(v.volume<=1-step){
    v.volume+=step;
  }
}

function volumeDown(v,step){
  if(v.volume>=step){
    v.volume-=step;
  }
}

function speedUp(v,step){
  if(v.playbackRate<=16-step){
    v.playbackRate+=step;
  }
}

function slowDown(v,step){
  if(v.playbackRate>=step+0.0625){
    v.playbackRate-=step;
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
}

function toggleFullscreen(v){
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

document.addEventListener("DOMContentLoaded", init);
