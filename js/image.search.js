var parameters={};
var ids=["google","baidu","tineye","bing","yandex","saucenao","iqdb"];
var result;
function getParameters(){
  var temp=window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i=0;i<temp.length;i++){
    var temp2=temp[i].split('=');
    var key=temp2[0];
    var value=temp2[1];
    parameters[key]=value;
  }
}

function clean(){
  $('#keywords').html("");
  $('#relatedWebsites').html("");
  $('#moreResults').html("");
  $('#moreResults').html("");
  $('#websites').html("");
}

function display(){
  clean();
  $('#imageDiv').html('<img id="imageInput" src="'+result.imageUrl+'"></img>');
  isOn('imageSearchUrl_bing',function(){
    var bingKeyword=(result.bingKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.bingUrl+'">'+'(by Bing)'+'</a>';
    $('#keywords').append('<li>'+bingKeyword+'</li>');
  });
  isOn('imageSearchUrl_bing',function(){
    var googleKeyword=(result.googleKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.googleUrl+'">'+'(by Google)'+'</a>';
    $('#keywords').append('<li>'+googleKeyword+'</li>');
  });
  isOn('imageSearchUrl_bing',function(){
    var baiduKeyword=(result.baiduKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.baiduUrl+'">'+'(by Baidu)'+'</a>';
    $('#keywords').append('<li>'+baiduKeyword+'</li>');
  });
  isOn('imageSearchUrl_baidu',function(){
    displayRelatedWebsites(result.baiduRelatedWebsites||[]);
  });
  isOn('imageSearchUrl_google',function(){
    displayRelatedWebsites(result.googleRelatedWebsites||[]);
  });
  isOn('imageSearchUrl_iqdb',function(){
    displayWebsites(result.iqdbRelatedWebsites||[]);
  });
  isOn('imageSearchUrl_google',function(){
    displayWebsites(result.googleWebsites||[]);
  });
  isOn('imageSearchUrl_baidu',function(){
    displayWebsites(result.baiduWebsites||[]);
  });
  isOn('imageSearchUrl_saucenao',function(){
    displayWebsites(result.saucenaoRelatedWebsites||[]);
  });
  isOn('imageSearchUrl_yandex',function(){
    if(result.yandexWebsites){
      displayWebsites(result.yandexWebsites.slice(0,3));
    }
  });
  isOn('imageSearchUrl_yandex',function(){
    if(result.yandexWebsites){
      displayWebsites(result.yandexWebsites.slice(3,result.yandexWebsites.length));
    }
  });
  isOn('imageSearchUrl_saucenao',function(){
    displayWebsites(result.saucenaoWebsites||[]);
  });
  isOn('imageSearchUrl_iqdb',function(){
    displayWebsites(result.iqdbWebsites||[]);
  });
  
  
  for(var i=0;i<ids.length;i++){
    isOn('imageSearchUrl_'+ids[i],
      (function(ii){
        $('#moreResults').append('<li><a target="_blank"  href="'+result[ids[ii]+'Url']+'"><img class="moreResultsImages" src="thirdParty/'+ids[ii]+'.png" /></a></li>');
      }),
      function(){
      },
      i
    );
  }
}

function displayRelatedWebsites(websiteList){
  for(var i=0;i<websiteList.length;i++){
    var website=websiteList[i];
    $('#relatedWebsites').append('<div class="websiteLink"><div class="websiteLinkHeader"><img class="websiteSearchIcon" src="thirdParty/'+website.searchEngine+'.png" /><a target="_blank"  class="relatedWebsiteTitle" href="'+website.link+'">'+website.title+'</a></div><div class="relatedWebsiteDescription">'+website.description+'</div></div>');
  }
}

function displayWebsites(websiteList){
  for(var i=0;i<websiteList.length;i++){
    var website=websiteList[i];
    var html='<div class="websiteLink"><div class="websiteLinkHeader"><img class="websiteSearchIcon" src="thirdParty/'+website.searchEngine+'.png" /><a target="_blank"  class="websiteTitle" href="'+website.link+'">'+website.title+'</a></div>';
    if(website.imageUrl)
      html+='<img class="websiteImage" src="'+website.imageUrl+'"></img>';
    html+='<div class="websiteDescription">'+website.description+'</div></div>'
    $('#websites').append(html);
  }
}

function style(){
}

function parse(){
  result=result[parameters.cursor];
}

function displayLoader(){
  console.log(result.remains);
  var i=result.remains;
  for(var j=1;j<=ids.length;j++){
    $(".loading"+j).hide();
  }
  for(var j=1;j<=i;j++){
    $(".loading"+j).show();
  }
}

function update(){
  getDB('NooBox.Image.result',function(value){
    result=JSON.parse(value);
    parse();
    display();
    displayLoader();
  });
}

function init(){
  getParameters();
  update();
}
document.addEventListener('DOMContentLoaded', function(){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.job.indexOf("update")!=-1){
        update();
      }
    });
  init();
});

function isOn(key,callbackTrue,callbackFalse,parameter){
  get(key,function(value){
    if(value=='1'){
      if(callbackTrue){
        callbackTrue(parameter);
      }
    }
    else{
      if(callbackFalse){
        callbackFalse(parameter);
      }
    }
  });
}

function setIfNull(key,setValue,callback,callbackCallback){
  get(key,function(value){
    if(!value){
      set(key,setValue,callback);
    }
    else{
      if(callback)
        callback(callbackCallback);
    }
  });
}

function setDB(key,value,callback){
  localStorage.setItem(key,value);
  callback();
}

function getDB(key,callback){
  if(callback){
    callback(localStorage.getItem(key));
  }
}

function set(key,value,callback){
  var temp={};
  temp[key]=value;
  console.log(temp);
  chrome.storage.sync.set(temp,callback);
}

function get(key,callback){
  chrome.storage.sync.get(key,function(result){
    if(callback)
      callback(result[key]);
  });
}
