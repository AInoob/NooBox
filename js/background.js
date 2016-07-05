var NooBox=NooBox||{};
NooBox.Image={};
NooBox.Image.ids=["google","baidu","tineye","bing"];
NooBox.Image.apiUrls=[
  "https://www.google.com/searchbyimage?&image_url=",
  "http://image.baidu.com/n/pc_search?rn=10&queryImageUrl=",
  "http://www.tineye.com/search/?url=",
  "http://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:"
];
NooBox.Image.fetchFunctions={};
NooBox.Image.result=[];
NooBox.Image.imageFromUrl=function(info,tab){
  var cursor=NooBox.Image.result.length;
  NooBox.Image.result.push({});
  NooBox.Image.result[cursor].imageUrl=info.srcUrl;
  NooBox.Image.result[cursor].remains=NooBox.Image.ids.length;
  NooBox.Image.update(cursor);
  for(var i=0;i<NooBox.Image.ids.length;i++){
    (function(i){
      var url=NooBox.Image.apiUrls[i]+info.srcUrl;
      NooBox.Image.result[cursor][NooBox.Image.ids[i]+'Url']=url;
      $.ajax({url:url}).done(function(data){
        NooBox.Image.fetchFunctions[NooBox.Image.ids[i]](cursor,data);
      }).fail(function(error){
        console.log(error);
      });
    })(i);
  }
  var url='/image.search.html?cursor='+cursor;
  chrome.tabs.create({url:url});
}

NooBox.Image.update=function(i){
  NooBox.Image.result[i].remains=NooBox.Image.result[i].remains-1;
  localStorage.setItem('NooBox.Image.result',JSON.stringify(NooBox.Image.result));
  chrome.runtime.sendMessage({job: 'update'}, function(response) {});
}


var page;
NooBox.Image.fetchFunctions.google=function(cursor,data){
  data=data.replace(/<img[^>]*>/g,"");
  page=$(data);
  var keyword=page.find('._gUb').text();
  var relatedWebsites=[];
  var relatedWebsiteLinks=page.find('.srg').first().find('.g').find('.r').find('a');
  var relatedWebsiteDescriptions=page.find('.srg').first().find('.g').find('.s').find('.st');
  for(var i=0;i<relatedWebsiteLinks.length;i++){
    var website={};
    website.link=relatedWebsiteLinks[i].href;
    website.title=relatedWebsiteLinks[i].innerText;
    website.description=relatedWebsiteDescriptions[i].innerHTML;
    relatedWebsites.push(website);
  }
  var websites=[];
  var websiteLinks=page.find('.srg').last().find('.g').find('.r').find('a');
  var websiteImages=page.find('.srg').last().find('._lyb').find('a');
  var websiteDescriptions=page.find('.srg').last().find('.g').find('.s').find('.st');
  for(var i=0;i<websiteLinks.length;i++){
    var website={};
    website.link=websiteLinks[i].href;
    website.title=websiteLinks[i].innerText;
    var start=websiteImages[i].href.indexOf("imgurl=")+7;
    var end=websiteImages[i].href.indexOf("&",start);
    if(end==-1)
      website.imageUrl=websiteImages[i].href.slice(start);
    else
      website.imageUrl=websiteImages[i].href.slice(start,end);
    website.description=websiteDescriptions[i].innerHTML;
    websites.push(website);
  }
  NooBox.Image.result[cursor].googleKeyword=keyword;
  NooBox.Image.result[cursor].googleRelatedWebsites=relatedWebsites;
  NooBox.Image.result[cursor].googleWebsites=websites;
  NooBox.Image.update(cursor);
};

NooBox.Image.fetchFunctions.baidu=function(cursor,data){
  data=data.replace(/<img[^>]*>/g,"");
  var page=$(data);
  var keyword=page.find('.guess-info-word-link').text();
  var relatedWebsites=[];
  var relatedWebsiteLinks=page.find('.guess-baike').find('.guess-baike-title').find('a');
  var relatedWebsiteDescriptions=page.find('.guess-baike').find('.guess-baike-text');
  for(var i=0;i<relatedWebsiteLinks.length;i++){
    var website={};
    website.link=relatedWebsiteLinks[i].href;
    website.title=relatedWebsiteLinks[i].innerText;
    website.description=relatedWebsiteDescriptions[i].innerHTML;
    relatedWebsites.push(website);
  }
  var relatedWebsiteLinks=page.find('.guess-newbaike').find('.guess-newbaike-text-title').find('a');
  var relatedWebsiteDescriptions=page.find('.guess-newbaike').find('.guess-newbaike-text-box');
  for(var i=0;i<relatedWebsiteLinks.length;i++){
    var website={};
    website.link=relatedWebsiteLinks[i].href;
    website.title=relatedWebsiteLinks[i].innerText;
    website.description=relatedWebsiteDescriptions[i].innerHTML;
    relatedWebsites.push(website);
  }
  var websites=[];
  var websiteImages=page.find('.source-card').find('.source-card-topic-same-image');
  var websiteLinks=page.find('.source-card').find('.source-card-topic-title').find('a');
  var websiteDescriptions=page.find('.source-card').find('.source-card-topic-content');
  for(var i=0;i<websiteLinks.length;i++){
    var website={};
    website.link=websiteLinks[i].href;
    website.title=websiteLinks[i].innerText;
    website.description=websiteDescriptions[i].innerHTML;
    var start=websiteImages[i].style.backgroundImage.indexOf('http');
    var end=websiteImages[i].style.backgroundImage.indexOf('")');
    website.imageUrl=websiteImages[i].style.backgroundImage.slice(start,end);
    websites.push(website);
  }
  NooBox.Image.result[cursor].baiduKeyword=keyword;
  NooBox.Image.result[cursor].baiduRelatedWebsites=relatedWebsites;
  NooBox.Image.result[cursor].baiduWebsites=websites;
  NooBox.Image.update(cursor);
};

NooBox.Image.fetchFunctions.tineye=function(cursor,data){
  data=data.replace(/<img[^>]*>/g,"");
};

NooBox.Image.fetchFunctions.bing=function(cursor,data){
  data=data.replace(/<img[^>]*>/g,"");
  var keyword=$(data).find('.query').text();
  NooBox.Image.result[cursor].bingKeyword=keyword;
  NooBox.Image.update(cursor);
};

chrome.contextMenus.create({
  "title": "Search this Image",
  "contexts": ["image"],
  "onclick": NooBox.Image.imageFromUrl
});
