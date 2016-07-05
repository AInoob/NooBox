var parameters={};
var ids=["google","baidu","tineye","bing"];
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
  var bingKeyword=(result.bingKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+result.bingUrl+'">'+'(by Bing)'+'</a>';
  $('#keywords').append('<li>'+bingKeyword+'</li>');
  var googleKeyword=(result.googleKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+result.googleUrl+'">'+'(by Google)'+'</a>';
  $('#keywords').append('<li>'+googleKeyword+'</li>');
  var baiduKeyword=(result.baiduKeyword||'(None)')+'&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+result.baiduUrl+'">'+'(by Baidu)'+'</a>';
  $('#keywords').append('<li>'+baiduKeyword+'</li>');
  var baiduRelatedWebsites=(result.baiduRelatedWebsites||[]);
  for(var i=0;i<baiduRelatedWebsites.length;i++){
    var website=baiduRelatedWebsites[i];
    $('#relatedWebsites').append('<div class="websiteLink"><a class="relatedWebsiteTitle" href="'+website.link+'">'+website.title+'</a><div class="relatedWebsiteDescription">'+website.description+'</div></div>');
  }
  var googleRelatedWebsites=(result.googleRelatedWebsites||[]);
  for(var i=0;i<googleRelatedWebsites.length;i++){
    var website=googleRelatedWebsites[i];
    $('#relatedWebsites').append('<div class="websiteLink"><a class="relatedWebsiteTitle" href="'+website.link+'">'+website.title+'</a><div class="relatedWebsiteDescription">'+website.description+'</div></div>');
  }
  var baiduWebsites=(result.baiduWebsites||[]);
  for(var i=0;i<baiduWebsites.length;i++){
    var website=baiduWebsites[i];
    var html='<div class="websiteLink"><a class="websiteTitle" href="'+website.link+'">'+website.title+'</a>';
    if(website.imageUrl)
      html+='<img class="websiteImage" src="'+website.imageUrl+'"></img>';
    html+='<div class="websiteDescription">'+website.description+'</div></div>'
    $('#websites').append(html);
  }
  var googleWebsites=(result.googleWebsites||[]);
  for(var i=0;i<googleWebsites.length;i++){
    var website=googleWebsites[i];
    var html='<div class="websiteLink"><a class="websiteTitle" href="'+website.link+'">'+website.title+'</a>';
    if(website.imageUrl)
      html+='<img class="websiteImage" src="'+website.imageUrl+'"></img>';
    html+='<div class="websiteDescription">'+website.description+'</div></div>'
    $('#websites').append(html);
  }
  for(var i=0;i<ids.length;i++){
    $('#moreResults').append('<li><a href="'+result[ids[i]+'Url']+'"><img class="moreResultsImages" src="thirdParty/'+ids[i]+'.png" /></a></li>');
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
