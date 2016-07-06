var NooBox=NooBox||{};
NooBox.Image={};
NooBox.Image.ids=["google","baidu","tineye","bing","yandex"];
NooBox.Image.apiUrls=[
  "https://www.google.com/searchbyimage?&image_url=",
  "http://image.baidu.com/n/pc_search?rn=10&queryImageUrl=",
  "http://www.tineye.com/search/?url=",
  "http://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:",
  "https://www.yandex.com/images/search?rpt=imageview&img_url="
];
NooBox.Image.fetchFunctions={};
NooBox.Image.result=[];
NooBox.Image.imageFromUrl=function(info,tab){
  var cursor=NooBox.Image.result.length;
  NooBox.Image.result.push({});
  NooBox.Image.result[cursor].imageUrl=info.srcUrl;
  //tineye is not in use for now
  NooBox.Image.result[cursor].remains=NooBox.Image.ids.length-1+1;
  NooBox.Image.update(cursor);
  for(var i=0;i<NooBox.Image.ids.length;i++){
    if(i==2)
      i++;
    (function(i){
      var url=NooBox.Image.apiUrls[i]+info.srcUrl;
      NooBox.Image.result[cursor][NooBox.Image.ids[i]+'Url']=url;
      $.ajax({url:url}).done(function(data){
        NooBox.Image.fetchFunctions[NooBox.Image.ids[i]](cursor,data);
      }).fail(function(error){
        NooBox.Image.update(cursor);
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

chrome.contextMenus.create({
  "title": "Search this Image",
  "contexts": ["image"],
  "onclick": NooBox.Image.imageFromUrl
});
