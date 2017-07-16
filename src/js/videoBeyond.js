var beyondCtx=null;
document.addEventListener("DOMContentLoaded", function(){
  isOn('videoControl',function(){
    $('body').append('<div id="NooBox-VideoBeyond" style="position:fixed;left:0;top:0"><canvas style="width:800px;height:500px" id="NooBox-VideoBeyond-canvas"></canvas></div>');
    var canvas=$('#NooBox-VideoBeyond-canvas')[0];
    var ctx=canvas.getContext('2d');
    beyondCtx=ctx;
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse){
        if(request.job=='videoBeyond'){
          var prev=request.prev;
          temp=new Date().getTime();
          console.log('4 getMessage: '+(temp-prev));
          var img = new Image;
          img.src = request.dataURI;
          temp=new Date().getTime();
          console.log('5 image: '+(temp-prev));
          ctx.drawImage(img,0,0);
          temp=new Date().getTime();
          console.log('6 done: '+(temp-prev));
          prev=temp;
        }
      }
    );
  });
});
