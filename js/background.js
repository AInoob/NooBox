var defaultValues=[
	['imageSearchUrl_google','1'],	
	['imageSearchUrl_baidu','1'],	
	['imageSearchUrl_tineye','-1'],	
	['imageSearchUrl_bing','1'],	
	['imageSearchUrl_yandex','1'],	
	['imageSearchUrl_saucenao','1'],	
	['imageSearchUrl_iqdb','1'],	
];
var NooBox=NooBox||{};
NooBox.Image={};
NooBox.Image.ids=["google","baidu","tineye","bing","yandex","saucenao","iqdb"];
NooBox.Image.apiUrls={
  google:   "https://www.google.com/searchbyimage?&image_url=",
  baidu:    "http://image.baidu.com/n/pc_search?rn=10&queryImageUrl=",
  tineye:   "http://www.tineye.com/search/?url=",
  bing:     "http://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:",
  yandex:   "https://www.yandex.com/images/search?rpt=imageview&img_url=",
  saucenao: "http://saucenao.com/search.php?db=999&url=",
  iqdb:     "http://iqdb.org/?url="
};
NooBox.Image.fetchFunctions={};
NooBox.Image.result=[];
NooBox.Image.imageFromUrl=function(info,tab){
  var cursor=NooBox.Image.result.length;
  NooBox.Image.result.push({});
  NooBox.Image.result[cursor].imageUrl=info.srcUrl;
  //tineye is not in use for now
  NooBox.Image.result[cursor].remains=0;
  for(var i=0;i<NooBox.Image.ids.length;i++){
    var engine=NooBox.Image.ids[i];
    if(isOn('imageSearchUrl_'+engine)){
      NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains+1;
    }
  }
  NooBox.Image.update(cursor);
  for(var i=0;i<NooBox.Image.ids.length;i++){
    var engine=NooBox.Image.ids[i];
    if(isOn('imageSearchUrl_'+engine)){
      (function(engine){
        var url=NooBox.Image.apiUrls[engine]+info.srcUrl;
        NooBox.Image.result[cursor][engine+'Url']=url;
        $.ajax({url:url}).done(function(data){
          NooBox.Image.fetchFunctions[engine](cursor,data);
        }).fail(function(error){
          NooBox.Image.update(cursor);
          console.log(error);
        });
      })(engine);
    }
    }
    var url='/image.search.html?cursor='+cursor;
    chrome.tabs.create({url:url});
    }

    NooBox.Image.update=function(i){
      NooBox.Image.result[i].remains=NooBox.Image.result[i].remains-1;
      localStorage.setItem('NooBox.Image.result',JSON.stringify(NooBox.Image.result));
  chrome.runtime.sendMessage({job: 'update'}, function(response) {});
}


NooBox.Image.fetchFunctions.google=function(cursor,data){
  try{
  data=data.replace(/<img[^>]*>/g,"");
  var page=$(data);
  var keyword=page.find('._gUb').text();
  var relatedWebsites=[];
  var relatedWebsiteList=$(page.find('#rso').find('.rgsep')[0]).prev().find('.rc')
  for(var i=0;i<relatedWebsiteList.length;i++){
    var website={};
    var temp=$(relatedWebsiteList[i]);
    var x=temp.find('a')[0];
    website.link=x.href;
    website.title=x.innerText;
    var y=temp.find('.s').find('.st')[0];
    website.description=y.innerHTML;
    website.searchEngine='google';
    relatedWebsites.push(website);
  }
  var websites=[];
  var websiteList=$(page.find('#rso').find('.rgsep')).last().prev().find('.rc');
  for(var i=0;i<websiteList.length;i++){
    var website={};
    var temp=$(websiteList[i]);
    var x=temp.find('a')[0];
    website.link=x.href;
    website.title=x.innerText;
    var y=temp.find('.s').find('.st')[0];
    website.description=y.innerHTML;
    var z=temp.find('._lyb').find('a')[0];

    if(z!=null){
      var start=z.href.indexOf("imgurl=")+7;
      var end=z.href.indexOf("&",start);
      if(end==-1)
        website.imageUrl=z.href.slice(start);
      else
        website.imageUrl=z.href.slice(start,end);
    }
    website.searchEngine='google';
    websites.push(website);
  }
  NooBox.Image.result[cursor].googleKeyword=keyword;
  NooBox.Image.result[cursor].googleRelatedWebsites=relatedWebsites;
  NooBox.Image.result[cursor].googleWebsites=websites;
  NooBox.Image.update(cursor);
  }
  catch(e){
    console.log(e);
    NooBox.Image.update(cursor);
  }
};

NooBox.Image.fetchFunctions.baidu=function(cursor,data){
  try{
  data=data.replace(/<img[^>]*>/g,"");
  var page=$(data);
  var keyword=page.find('.guess-info-word-link').text()||page.find('.guess-info-text-link').text();
  var relatedWebsites=[];
  var relatedWebsiteLinks=page.find('.guess-baike').find('.guess-baike-title').find('a');
  var relatedWebsiteDescriptions=page.find('.guess-baike').find('.guess-baike-text');
  for(var i=0;i<relatedWebsiteLinks.length;i++){
    var website={};
    website.link=relatedWebsiteLinks[i].href;
    website.title=relatedWebsiteLinks[i].innerText;
    website.description=relatedWebsiteDescriptions[i].innerHTML;
    website.searchEngine='baidu';
    relatedWebsites.push(website);
  }
  var relatedWebsiteLinks=page.find('.guess-newbaike').find('.guess-newbaike-text-title').find('a');
  var relatedWebsiteDescriptions=page.find('.guess-newbaike').find('.guess-newbaike-text-box');
  for(var i=0;i<relatedWebsiteLinks.length;i++){
    var website={};
    website.link=relatedWebsiteLinks[i].href;
    website.title=relatedWebsiteLinks[i].innerText;
    website.description=relatedWebsiteDescriptions[i].innerHTML;
    website.searchEngine='baidu';
    relatedWebsites.push(website);
  }
  var websites=[];
  var websiteList=page.find('.source-card-topic');
  for(var i=0;i<websiteList.length;i++){
    var website={};
    var temp=$(websiteList[i]);
    var x=temp.find('a')[0];
    website.link=x.href;
    website.title=x.innerText;
    var y=temp.find('.source-card-topic-content')[0];
    website.description=y.innerHTML;
    var z=temp.find('.source-card-topic-same-image')[0];
    if(z){
      var start=z.style.backgroundImage.indexOf('http');
      var end=z.style.backgroundImage.indexOf('")');
      website.imageUrl=z.style.backgroundImage.slice(start,end);
      website.imageUrl=website.imageUrl.replace(/&amp;/g,'');
    }
    website.searchEngine='baidu';
    websites.push(website);
  }
  NooBox.Image.result[cursor].baiduKeyword=keyword;
  NooBox.Image.result[cursor].baiduRelatedWebsites=relatedWebsites;
  NooBox.Image.result[cursor].baiduWebsites=websites;
  NooBox.Image.update(cursor);
  }
  catch(e){
    console.log(e);
    NooBox.Image.update(cursor);
  }
};

NooBox.Image.fetchFunctions.tineye=function(cursor,data){
//  data=data.replace(/<img[^>]*>/g,"");
};

NooBox.Image.fetchFunctions.bing=function(cursor,data){
  try{
  data=data.replace(/<img[^>]*>/g,"");
  var keyword=$(data).find('.query').text();
  NooBox.Image.result[cursor].bingKeyword=keyword;
  NooBox.Image.update(cursor);
  }
  catch(e){
    NooBox.Image.update(cursor);
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.yandex=function(cursor,data){
  try{
  data=data.replace(/<img[^>]*>/g,"");
  var page=$(data);
  var websites=[];
  var websiteList=$(page.find('.other-sites__item'));
  for(var i=0;i<websiteList.length;i++){
    var website={};
    var temp=$(websiteList[i]);
    var x=temp.find('.other-sites__snippet').find('a')[0];
    website.link=x.href;
    website.title=x.innerText;
    var y=temp.find('.other-sites__desc')[0];
    website.description=y.innerHTML;
    var z=temp.find('.other-sites__preview-link')[0];

    website.imageUrl=z.href;
    website.searchEngine='yandex';
    websites.push(website);
  }
  NooBox.Image.result[cursor].yandexWebsites=websites;
  NooBox.Image.update(cursor);
  }
  catch(e){
    NooBox.Image.update(cursor);
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.saucenao=function(cursor,data){
  try{
  data=data.replace(/ src=/g," nb-src=");
  var page=$(data);
  var websites=[];
  var websiteList=$(page.find('#result-hidden-notification').prevAll('.result'));
  for(var i=0;i<websiteList.length;i++){
    var website={};
    var temp=$(websiteList[i]);
    website.link="";
    website.title="";
    var y=temp.find('.resulttablecontent')[0];
    website.description=y.innerHTML.replace(/(nb-src="\/image|nb-src="image)/g,'src="http://saucenao.com/image');
    var z=temp.find('.resultimage').find('img')[0];
    website.imageUrl=z.getAttribute('nb-src');
    website.searchEngine='saucenao';
    websites.push(website);
  }
  NooBox.Image.result[cursor].saucenaoRelatedWebsites=websites;
  websites=[];
  var websiteList=$(page.find('#result-hidden-notification').nextAll('.result'));
  for(var i=0;i<websiteList.length;i++){
    var website={};
    var temp=$(websiteList[i]);
    website.link="";
    website.title="";
    var y=temp.find('.resulttablecontent')[0];
    website.description=y.innerHTML.replace(/(nb-src="\/image|nb-src="image)/g,'src="http://saucenao.com/image');
    var z=temp.find('.resultimage').find('img')[0];
    website.imageUrl=z.getAttribute('data-src');
    website.searchEngine='saucenao';
    websites.push(website);
  }
  NooBox.Image.result[cursor].saucenaoWebsites=websites;
  NooBox.Image.update(cursor);
  }
  catch(e){
    NooBox.Image.update(cursor);
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.iqdb=function(cursor,data){
  try{
  data=data.replace(/ src=\'\/([^\/])/g," nb-src='$1");
  data=data.replace(/ src=\"\/\//g,' nb1-src="');
  var page=$(data);
  var websites=[];
  var websiteList=$(page.find('table'));
  for(var i=1;i<websiteList.length-2;i++){
    var description='<table>'+websiteList[i].innerHTML.replace(/nb-src="/g,'src="http://iqdb.org/')+'</table>';
    description=description.replace(/nb1-src="/g,'src="http://');
    var website={link:"",title:"",imageUrl:"",searchEngine:"iqdb",description:description};
    console.log(website);
    if(websiteList[i].innerHTML.indexOf("Best match")!=-1){
      NooBox.Image.result[cursor].saucenaoRelatedWebsites=[website];
    }
    else{
      websites.push(website);
    }
  }
  NooBox.Image.result[cursor].iqdbWebsites=websites;
  NooBox.Image.update(cursor);
  }
  catch(e){
    NooBox.Image.update(cursor);
    console.log(e);
  }
};



function init(){
	for(var i=0;i<defaultValues.length;i++){
		setIfNull(defaultValues[i][0],defaultValues[i][1]);
	}
    chrome.contextMenus.create({
      "title": "Search this Image",
      "contexts": ["image"],
      "onclick": NooBox.Image.imageFromUrl
    });
}
document.addEventListener('DOMContentLoaded', function(){
  init();
});
	

function isOn(key){
  return localStorage.getItem(key)=='1';
}

function setIfNull(s,o){
	if(getItem(s)==null){
		setItem(s,o);
	}
}

function setItem(key,value){
  localStorage.setItem(key,value);
}

function getItem(key){
  localStorage.getItem(key);
}

