var parameters={};
var ids=["google","baidu","tineye","bing","yandex","saucenao"];
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
  if(isOn('imageSearchUrl_bing')){
    var bingKeyword=(result.bingKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.bingUrl+'">'+'(by Bing)'+'</a>';
    $('#keywords').append('<li>'+bingKeyword+'</li>');
  }
  if(isOn('imageSearchUrl_bing')){
    var googleKeyword=(result.googleKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.googleUrl+'">'+'(by Google)'+'</a>';
    $('#keywords').append('<li>'+googleKeyword+'</li>');
  }
  if(isOn('imageSearchUrl_bing')){
    var baiduKeyword=(result.baiduKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank"  href="'+result.baiduUrl+'">'+'(by Baidu)'+'</a>';
    $('#keywords').append('<li>'+baiduKeyword+'</li>');
  }
  if(isOn('imageSearchUrl_baidu')){
    displayRelatedWebsites(result.baiduRelatedWebsites||[]);
  }
  if(isOn('imageSearchUrl_google')){
    displayRelatedWebsites(result.googleRelatedWebsites||[]);
  }
  if(isOn('imageSearchUrl_google')){
    displayWebsites(result.googleWebsites||[]);
  }
  if(isOn('imageSearchUrl_baidu')){
    displayWebsites(result.baiduWebsites||[]);
  }
  if(isOn('imageSearchUrl_saucenao')){
    displayWebsites(result.saucenaoRelatedWebsites||[]);
  }
  if(isOn('imageSearchUrl_yandex')){
    displayWebsites(result.yandexWebsites||[]);
  }
  if(isOn('imageSearchUrl_saucenao')){
    displayWebsites(result.saucenaoWebsites||[]);
  }
  
  for(var i=0;i<ids.length;i++){
    if(isOn('imageSearchUrl_'+ids[i])){
      $('#moreResults').append('<li><a target="_blank"  href="'+result[ids[i]+'Url']+'"><img class="moreResultsImages" src="thirdParty/'+ids[i]+'.png" /></a></li>');
    }
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
  var i=result.remains;
  for(var j=1;j<=ids.length;j++){
    $(".loading"+j).hide();
  }
  for(var j=1;j<=i;j++){
    $(".loading"+j).show();
  }
}

function load(){
  result=JSON.parse(localStorage.getItem('NooBox.Image.result'));
}

function init(){
  getParameters();
  load();
  parse();
  display();
  displayLoader();
}
document.addEventListener('DOMContentLoaded', function(){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.job.indexOf("update")!=-1){
        load();
        parse();
        display();
        displayLoader();
      }
    });
  init();
});


function isOn(key){
  return localStorage.getItem(key)=='1';
}
