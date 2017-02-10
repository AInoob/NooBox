function get(key,callback){
  chrome.storage.sync.get(key,function(result){
    if(callback)
      callback(result[key]);
  });
}
function isOn(key,callbackTrue,callbackFalse,param){
  get(key,function(value){
    if(value=='1'){
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

var imgSet;
var notImgSet={};
var isImgSet={};
var focus=null;

function getImages(){
  var linkImage=$('#linkImage').prop('checked');
  var notification=false;
  var val=$('#NooBox-extractImages-selector-range').val();
  var gallery=$('#NooBox-extractImages-gallery')[0];
  $(gallery).empty();
  var imgSet={};
  var tempFocus2=focus;
  for(var i=1;i<val;i++){
    tempFocus2=$(tempFocus2).parent()[0];
  }
  getAllImgs=function(elem){
    $(elem).find('*').each(function(){
      if(this.tagName=="IMG"){
        imgSet[this.src]=true;
      }
      else{
        var bg=$(this).css('background-image');
        if(bg){
          var url = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
          if(url!="none"&&(!url.match(/^gradient/))&&(!url.match(/^linear-gradient/))){
            imgSet[url]=true;
          }
        }
      }
      if(linkImage&&this.tagName=='A'){
        if(isImgSet[this.href]==true){
          imgSet[this.href]=true;
        }
        else{
          if(!notImgSet[this.href]==true){
            getValidImage(this.href);
          }
        }
      }
      if(this.tagName=='IFRAME'){
        if(!notification){
          notification=true;
        }
        //getAllImgs(this.contentDocument);
      }
    });
  }
  getAllImgs(tempFocus2);
  Object.keys(imgSet).forEach(function(elem){
    $(gallery).append('<img src="'+elem+'" style="margin:0px;border:0px;padding:0px;max-width:100%;" />');
  });
  //location.href = "#NooBox-extractImages-selector-range"; 
}

function getValidImage(url) {
  if(url&&url.length>0&&(!notImgSet[url]==true)){
    var img=$('<img src="'+url+'">');
    $(img).on('error',function(){
      notImgSet[url]=true;
    });
    $(img).on('load',function(){
      if(!imgSet[url]==true){
        var gallery=$('#NooBox-extractImages-gallery')[0];
        imgSet[url]=true;
        isImgSet[url]=true;
        $(gallery).append('<img src="'+url+'" style="margin:0px;border:0px;padding:0px;max-width:100%;" />');
      }
    });
  }
}

window.oncontextmenu = function (e){
  focus=e.target;
}
var init=function(){
  isOn("extractImages",function(){
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(request.job){
          if(request.job=="extractImages"){
            $(document.head).append('<style>input[type="checkbox"] ~ .inputLabel{cursor:pointer;position:absolute;margin-top: -18px;margin-left: 19px;width: 174px;height: 28px;border: 4px solid transparent;border-bottom: 4px solid #5667bb;-webkit-transform: rotate(4deg);transform: rotate(4deg);}input[type="checkbox"]:checked ~ .inputLabel{margin-top:-12px;margin-left:163px;width: 18px;height: 38px;border: 4px solid transparent;border-right: 4px solid #5667bb;border-bottom: 4px solid #5667bb;-webkit-transform: rotate(40deg);transform: rotate(40deg);}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none!important;background-color:#E9E9E9;border:1pxsolid#CECECE;height:15px;width:15px;}</style>');
            if(!focus||focus.tagName=='HTML'){
              focus=document.body;
            }
            sendResponse({success:true});
            chrome.runtime.sendMessage({job:'analytics',category:'extractImage',action:'run'}, function(response) {});
            console.log('aaaa');
            var images=[];
            var height=window.innerHeight-66;
            var div = $('<div id="NooBox-extractImages">').css({"z-index":"999999999999999999999","height":height*0.9+"px","overflow":"auto","background-color":"rgba(0,0,0,0.7)","padding":"33px","position": "fixed","margin-left":"20%","width":"60%","top":height*0.05+"px"});
            var max=1;
            var tempFocus=focus;
            while(tempFocus.tagName!='BODY'){
              tempFocus=$(tempFocus).parent()[0];
              max++;
            }
            div.append('<div><span id="NooBox-extractImages-selector-left" style="user-select: none;line-height:16px;margin:0px;cursor:pointer;border:0px;padding:0px;z-index:999999999999999999999;margin-top:0px;display:block;float:left;color:white;font-size:33px"><</span><input type="range" id="NooBox-extractImages-selector-range" style="-webkit-appearance: none;background-color:rgb(86, 103, 187);margin:0px;margin-left:13px;border:0px;padding:0px;display:block;float:left;pointer-events: none;height:8px;margin-top:4px;width:200px" value="1" min="1" max="'+max+'" step="1"><span id="NooBox-extractImages-selector-right" style="user-select: none;line-height:16px;margin:0px;margin-left:13px;cursor:pointer;border:0px;padding:0px;margin-top:0px;display:block;float:left;color:white;font-size:60px">></span><div style="position:relative;overflow:visible;height:18px;width:200px;float:left"><input type="checkbox" style="display:none" id="linkImage"><label class="inputLabel" id="linkImageLabel" for="linkImage" ></label><a style="color: white;margin-left: 30px;text-decoration: underline;font-size:15px">example.com/a.jpg</a></div></div>');
            div.append('<div id="NooBox-extractImages-switch" style="margin: 0px;border: 0px;padding: 0px;color: white;font-size: 62px;position: absolute;right: 0;top: 0;width: 64px;height: 64px;background-color: rgb(86, 103, 187);text-align: center;line-height: 64px;cursor: pointer;">X</>');
            div.append('<div style="margin:0px;border:0px;padding:0px;clear:both"></div>');
            if(focus.tagName!='BODY'&&focus.tagName!='HTML')
              focus=$(focus).parent()[0];
            var div2 = $('<div id="NooBox-extractImages-gallery" style="margin:0px;border:0px;padding:0px;width:80%;margin-top:32px"></div>');
            div.append(div2);
            $(document.body).append(div);
            getImages();
            $('#NooBox-extractImages-selector-left').on('click',function(e){
              var val=parseInt($('#NooBox-extractImages-selector-range').val());
              val--;
              $('#NooBox-extractImages-selector-range').val(val);
              getImages();
            });
            $('#NooBox-extractImages-selector-right').on('click',function(e){
              var val=parseInt($('#NooBox-extractImages-selector-range').val());
              val++;
              $('#NooBox-extractImages-selector-range').val(val);
              getImages();
            });
            $('#NooBox-extractImages-selector-range').on('change',function(e){
              getImages();
            });
            $('#NooBox-extractImages-switch').on('click',function(e){
              $(e.target).parent().remove();
            });
            $('#linkImageLabel').on('click',function(e){
              console.log('yay');
              getImages();
            });
          }
        }
      }
    );
  });
}
init();
