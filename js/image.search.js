var parameters={};
var ids=["google","baidu","tineye","bing","yandex","saucenao","iqdb"];
var activeEngines;
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
var isDataURI=false;

function display(engine){
  if(firstDisplay){
    firstDisplay=false;
    if(parameters.image.match(/^dataURI/)){
      $('#imageDiv').html('<img id="imageInput" src="'+result.dataURI+'"></img>');
    }
    else{
      $('#reSearch').show();
      $('#imageDiv').html('<img id="imageInput" src="'+result.imageUrl+'"></img>');
    }
    getImageSearchEngines(ids,function(engines){
      for(var i=0;i<engines.length;i++){
        $('#moreResults').append('<li id="moreResult'+engines[i]+'"><a target="_blank"  href=""><img class="moreResultLoader"" src="/images/loader.svg" /><img class="moreResultsImages" id="moreResultIcon'+engines[i]+'" src="/thirdParty/'+engines[i]+'.png" /></a></li>');
      }
      for(var i=0;i<result.finished.length;i++){
        var engine=result.finished[i];
        $('#'+engine+'Iframe').attr('src',result[engine+'Url']);
        remainIframes++;
        $('#moreResult'+engine).find('.moreResultLoader').hide();
        $('#moreResult'+engine).find('a').attr('href',result[engine+'Url']);
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
          case 'tineye':
            if(result.tineyeRelatedWebsites)
              displayWebsites(result.tineyeRelatedWebsites||[],'relatedWebsites_tineye');
            if(result.tineyeWebsites){
              displayWebsites(result.tineyeWebsites.slice(0,8)||[],'websites_tineye_0');
              displayWebsites(result.tineyeWebsites.slice(8,result.tineyeWebsites.length)||[],'websites_tineye_1');
            }
            break;
          case 'yandex':
            if(result.yandexWebsites){
              displayWebsites(result.yandexWebsites.slice(0,3)||[],'relatedWebsites_yandex');
              displayWebsites(result.yandexWebsites.slice(3,result.yandexWebsites.length)||[],'websites_yandex');
            }
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
    });

  }
  else{
    console.log(engine);
    if(engine!="none"){
      $('#'+engine+'Iframe').attr('src',result[engine+'Url']);
        $('#moreResult'+engine).find('.moreResultLoader').hide();
        $('#moreResult'+engine).find('a').attr('href',result[engine+'Url']);
      remainIframes++;
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
      case 'tineye':
        if(result.tineyeRelatedWebsites)
          displayWebsites(result.tineyeRelatedWebsites||[],'relatedWebsites_tineye');
        if(result.tineyeWebsites){
          displayWebsites(result.tineyeWebsites.slice(0,8)||[],'websites_tineye_0');
          displayWebsites(result.tineyeWebsites.slice(8,result.tineyeWebsites.length)||[],'websites_tineye_1');
        }
        break;
      case 'yandex':
        if(result.yandexWebsites){
          displayWebsites(result.yandexWebsites.slice(0,3)||[],'relatedWebsites_yandex');
          displayWebsites(result.yandexWebsites.slice(3,result.yandexWebsites.length)||[],'websites_yandex');
        }
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
  setTimeout(updateImageSize,100);
}

function updateImageSize(){
  $('.websiteLink').each(function(){
    var img=$(this).find('.websiteImage')[0];
    if(img){
      $(this).find('.websiteImageSize').text(img.naturalWidth+' * '+img.naturalHeight+' - ');
    }
  });
}

function displayWebsites(websiteList,id){
  var html="";
  for(var i=0;i<websiteList.length;i++){
    var website=websiteList[i];
    html+='<div class="websiteLink"><div class="websiteLinkHeader"><img class="websiteSearchIcon" src="thirdParty/'+website.searchEngine+'.png" /><a target="_blank"  class="websiteTitle" href="'+website.link+'">'+website.title+'</a></div>';
    if(website.imageUrl)
      html+='<a href="'+website.imageUrl+'"><img class="websiteImage" src="'+website.imageUrl+'"></img></a>';
    if(id.indexOf("google")==-1){
      html+='<div class="websiteDescription"><span class="websiteImageSize"></span>'+website.description+'</div></div>'
    }
    else{
      html+='<div class="websiteDescription">'+website.description+'</div></div>'
    }
  }
  $('#'+id).append(html);
}

function update(engine){
  getDB('NooBox.Image.result_'+parameters.cursor,function(value){
    result=value;
    display(engine);
    if(result.remains==0||(result.remains==-1&&((!activeEngines)||activeEngines.indexOf('saucenao')!=-1)&&result.finished.indexOf('saucenao')==-1)){
      setTimeout(function(){
        remainIframes=0;
      },1000);
      if((!isDataURI)){
        getImageSearchEngines(ids,function(engines){
          var noResult=true;
          for(var i=0;i<engines.length;i++){
            if(result[engines[i]+'Url']){
              noResult=false;
            }
          }
          if(noResult){
            reSearch();
          }
        });
        
      }
    }
  });
}

var reSearch=function(){
  var img=$('#imageInput')[0];
  var workerCanvas = document.createElement('canvas');
  workerCtx = workerCanvas.getContext('2d');
  workerCanvas.width = img.naturalWidth;
  workerCanvas.height = img.naturalHeight;
  workerCtx.drawImage(img, 0, 0);
  var imgDataURI = workerCanvas.toDataURL();
  chrome.runtime.sendMessage({job:'image_search_re_search',cursor:parameters.cursor,data:imgDataURI},function(response){
    window.close();
  });
}

var remainIframes=0;
function init(){
  $('#reSearch').click(reSearch);
  getImageSearchEngines(ids,function(engines){
    activeEngines=engines;
  });
  window.addEventListener('error', function(e) {
    setTimeout(function(){
      var temp=e.target.src;
      e.target.src='/images/loader.svg';
      if(remainIframes>0){
        setTimeout(function(){
          e.target.src=temp;
        },500);
      }
      else{
        e.target.src='';
      }
    },500);
  }, true);
  getParameters();
  if(parameters.image.match(/^dataURI/)){
    isDataURI=true;
  }
  update();
  updateBackgroundImage();
}

var updateBackgroundImage=function(){
  getDB('NooBox.Image.background',function(data){
    $('body').css('background-image','url('+data+')');
  });
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

