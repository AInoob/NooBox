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

var firstDisplay=true;
var isBlob=false;

function display(engine){
  if(firstDisplay){
    firstDisplay=false;
    $('#imageDiv').html('<img id="imageInput" src="'+result.imageUrl+'"></img>');
    if(!isBlob){
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
    else{
      for(engine of ids){
        if(result[engine+'Url']){
          $('#loadImages').append('<iframe src="'+result[engine+'Url']+'"></iframe>');
          $('#moreResults').append('<li><a target="_blank"  href="'+result[engine+'Url']+'"><img class="moreResultsImages" src="thirdParty/'+engine+'.png" /></a></li>');
        }
      }
    }
    for(engine of result.finished){
      switch(engine){
        case 'google':
          var googleKeyword=(result.googleKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.googleUrl+'">'+'(by Google)'+'</a>';
          $('#keywords_google').append(googleKeyword);
          displayWebsites(result.googleRelatedWebsites||[],'relatedWebsites_google');
          displayWebsites(result.googleWebsites||[],'websites_google');
          break;
        case 'bing':
          var bingKeyword=(result.bingKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.bingUrl+'">'+'(by Bing)'+'</a>';
          $('#keywords_bing').append(bingKeyword);
          break;
        case 'baidu':
          var baiduKeyword=(result.baiduKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.baiduUrl+'">'+'(by Baidu)'+'</a>';
          $('#keywords_baidu').append(baiduKeyword);
          displayWebsites(result.baiduRelatedWebsites||[],'relatedWebsites_baidu');
          displayWebsites(result.baiduWebsites||[],'websites_baidu');
          break;
        case 'yandex':
          displayWebsites(result.yandexWebsites.slice(0,3)||[],'relatedWebsites_yandex');
          displayWebsites(result.yandexWebsites.slice(3,result.yandexWebsites.length)||[],'websites_yandex');
          break;
        case 'saucenao':
          displayWebsites(result.saucenaoRelatedWebsites||[],'relatedWebsites_saucenao');
          displayWebsites(result.saucenaoWebsites||[],'websites_saucenao');
          break;
        case 'iqdb':
          displayWebsites(result.iqdbRelatedWebsites||[],'relatedWebsites_iqdb');
          displayWebsites(result.iqdbWebsites||[],'websites_iqdb');
          break;
      }
    }
  }
  else{
    $('#loadImages').append('<iframe src="'+result[engine+'Url']+'"></iframe>');
    if(isBlob){
      $('#moreResults').append('<li><a target="_blank"  href="'+result[engine+'Url']+'"><img class="moreResultsImages" src="thirdParty/'+engine+'.png" /></a></li>');
    }
    else{
      $('#moreResults').html('');
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
    switch(engine){
      case 'google':
        var googleKeyword=(result.googleKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.googleUrl+'">'+'(by Google)'+'</a>';
        $('#keywords_google').append(googleKeyword);
        displayWebsites(result.googleRelatedWebsites||[],'relatedWebsites_google');
        displayWebsites(result.googleWebsites||[],'websites_google');
        break;
      case 'bing':
        var bingKeyword=(result.bingKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.bingUrl+'">'+'(by Bing)'+'</a>';
        $('#keywords_bing').append(bingKeyword);
        break;
      case 'baidu':
        var baiduKeyword=(result.baiduKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.baiduUrl+'">'+'(by Baidu)'+'</a>';
        $('#keywords_baidu').append(baiduKeyword);
        displayWebsites(result.baiduRelatedWebsites||[],'relatedWebsites_baidu');
        displayWebsites(result.baiduWebsites||[],'websites_baidu');
        break;
      case 'yandex':
        displayWebsites(result.yandexWebsites.slice(0,3)||[],'relatedWebsites_yandex');
        displayWebsites(result.yandexWebsites.slice(3,result.yandexWebsites.length)||[],'websites_yandex');
        break;
      case 'saucenao':
        displayWebsites(result.saucenaoRelatedWebsites||[],'relatedWebsites_saucenao');
        displayWebsites(result.saucenaoWebsites||[],'websites_saucenao');
        break;
      case 'iqdb':
        displayWebsites(result.iqdbRelatedWebsites||[],'relatedWebsites_iqdb');
        displayWebsites(result.iqdbWebsites||[],'websites_iqdb');
        break;
    }
  }
}

function displayWebsites(websiteList,id){
  var html="";
  for(var i=0;i<websiteList.length;i++){
    var website=websiteList[i];
    html+='<div class="websiteLink"><div class="websiteLinkHeader"><img class="websiteSearchIcon" src="thirdParty/'+website.searchEngine+'.png" /><a target="_blank"  class="websiteTitle" href="'+website.link+'">'+website.title+'</a></div>';
    if(website.imageUrl)
      html+='<img class="websiteImage" src="'+website.imageUrl+'"></img>';
    html+='<div class="websiteDescription">'+website.description+'</div></div>'
  }
  $('#'+id).append(html);
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

function update(engine){
  getDB('NooBox.Image.result',function(value){
    result=JSON.parse(value);
    parse();
    display(engine);
    displayLoader();
    if(parameters.image.match(/^blob/)){
      $('#imageDiv').html('<img id="imageInput" src="'+result.blob+'"></img>');
    }
  });
}


function init(){
  window.addEventListener('error', function(e) {
        setTimeout(function(){
          var temp=e.target.src;
          e.target.src='/images/loader.svg';
          setTimeout(function(){
            e.target.src=temp;
          },500);
        },500);
  }, true);
  getParameters();
  if(parameters.image.match(/^blob/)){
    isBlob=true;
  }
  update();
}
document.addEventListener('DOMContentLoaded', function(){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.job=='image_result_update'&&request.cursor==parameters.cursor){
        update(request.engine);
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
  chrome.storage.sync.set(temp,callback);
}

function get(key,callback){
  chrome.storage.sync.get(key,function(result){
    if(callback)
      callback(result[key]);
  });
}

