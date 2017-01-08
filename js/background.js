//Using object as a class to wrap different sections and functions
var NooBox={};
var analyticsOnce=false;
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-77112662-5']);
(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
function analytics(request){
  if(!analyticsOnce){
    _gaq.push(['_trackPageview','background']);
    analyticsOnce=true;
  }
  _gaq.push(['_trackEvent', request.category, request.action,request.label]);
}
NooBox.Image={};
NooBox.Webmaster={};
NooBox.History={};
NooBox.Options={};
//Options section
NooBox.Options.init=null;
//Default settings, will be set to correspond values if the settings does not exist
//Store in chrome.storage.sync
NooBox.Options.defaultValues=null;
//Image section
NooBox.Image.reverseSearchCursor=0;
//contains functions that will fetch the useful data from search engines
NooBox.Image.fetchFunctions={};
//Handles of context menu
NooBox.Image.handles={};
//Functions to upload image to the internet
NooBox.Image.POST={};
//servers for uploading
NooBox.Image.POST.servers=['postimage.org','chuantu.biz'];
//the order of uploading if one failed
NooBox.Image.POST.serverOrder=[0,1];
//functions for uploading
NooBox.Image.POST.server={};
//upload the image then call itself, which will call fetch functions
NooBox.Image.POST.general=null;
//call POST.server[x] to upload image
NooBox.Image.POST.upload=null;
//upload the image to Baidu and call baidu fetch function
NooBox.Image.POST.baidu=null;
//Wrap the image for uploading
NooBox.Image.DataWrapper={};
//add or remove image context menus
NooBox.Image.updateContextMenu=null;
//list of search engines
NooBox.Image.engines=["google","baidu","tineye","bing","yandex","saucenao","iqdb"];
//URLs for each search engine
NooBox.Image.apiUrls=null;
//search an image given URL or dataURI
NooBox.Image.imageSearch=null;
//update result in DB and send message to image.search.html
NooBox.Image.update=null;
//inject and run scripts to current tab
NooBox.Image.screenshotSearch=null;
//inject and run scripts to current tab
NooBox.Image.extractImages=null;
//record the search history
NooBox.History.recordImageSearch=null;




//The implementation of functions and variables
NooBox.Options.defaultValues=[
  ['userId',(Math.random().toString(36)+'00000000000000000').slice(2, 19)],
  ['imageSearch',true],
  ['shorcut',false],
  ['unitsConverter',false],
  ['crypter',true],
  ['webmaster',true],
  ['general',true],
  ['background',false],
  ['imageSearchUrl_google',true],
  ['imageSearchUrl_baidu',true],
  ['imageSearchUrl_tineye',false],
  ['imageSearchUrl_bing',true],
  ['imageSearchUrl_yandex',true],
  ['imageSearchUrl_saucenao',false],
  ['imageSearchUrl_iqdb',false],
  ['extractImages',true],
  ['screenshotSearch',true],
  ['modules',['imageSearch']]
];

NooBox.Options.init=function(i){
  var defaultValues=NooBox.Options.defaultValues;
  if(i<defaultValues.length){
    setIfNull(defaultValues[i][0],defaultValues[i][1],NooBox.Options.init.bind(null,i+1));
  }
  else{
    NooBox.Image.updateContextMenu();
  }
}

NooBox.Image.updateContextMenu=function(){
  isOn('imageSearch',
    function(){
      if(!NooBox.Image.handles.imageSearch){
        NooBox.Image.handles.imageSearch=chrome.contextMenus.create({
          "title": GL("search_this_image"),
          "contexts": ["image"],
          "onclick": NooBox.Image.imageSearch
        });
      }
    },
    function(){
      if(NooBox.Image.handles.imageSearch){
        chrome.contextMenus.remove(NooBox.Image.handles.imageSearch);
      }
    }
  );
  isOn('extractImages',
    function(){
      if(!NooBox.Image.handles.extractImages){
        NooBox.Image.handles.extractImages=chrome.contextMenus.create({
          "id" : "extractImages",
          "title": GL("extract_images"),
          "contexts": ["browser_action","page","selection","frame","link","editable","video","audio"],
          "onclick": NooBox.Image.extractImages
        });
      }
    },
    function(){
      if(NooBox.Image.handles.extractImages){
        chrome.contextMenus.remove(NooBox.Image.handles,extractImages);
        NooBox.Image.handles.extractImages=null;
      }
    }
  );
  isOn('screenshotSearch',
    function(){
      if(!NooBox.Image.handles.screenshotSearch){
        NooBox.Image.handles.screenshotSearch=chrome.contextMenus.create({
          "id" : "screenshotSearch",
          "title": GL("screenshot_search"),
          "contexts": ["browser_action","page","selection","frame","link","editable","video","audio"],
          "onclick": NooBox.Image.screenshotSearch
        });
      }
    },
    function(){
      if(NooBox.Image.handles.screenshotSearch){
        chrome.contextMenus.remove(NooBox.Image.handles.screenshotSearch);
        NooBox.Image.handles.screenshotSearch=null;
      }
    }
    );
}

NooBox.Image.imageSearch=function(info){
  var source=info.srcUrl||info;
  getDB('imageCursor',function(cursor){
    if(typeof(cursor)==='number'){
      cursor++;
    }
    else{
      cursor=0;
    }
    setDB('imageCursor',cursor);
    NooBox.History.recordImageSearch(cursor,info);
    getImageSearchEngines(NooBox.Image.engines,function(engines){
      var action='dataURI';
      var result={
        engines: engines
      };
      for(var j=0;j<engines.length;j++){
        result[engines[j]]={result:'loading'};
      }
      var dataURI=encodeURI(source);
      //if it is dataURI, using NooBox.Image.POST to upload the image and search
      if(dataURI.match(/^data/)){
        result.imageUrl='dataURI';
        result.dataURI=dataURI;
        if(engines.indexOf('baidu')!=-1){
          NooBox.Image.POST.baidu(cursor,result,result.dataURI);
        }
        NooBox.Image.POST.general(cursor,result,engines,result.dataURI);
      }
      else{
        action='url';
        result.imageUrl=source;
        for(var i=0;i<engines.length;i++){
          (function(cursor,engine){
            var url2=NooBox.Image.apiUrls[engine]+source;
            result[engine].url=url2;
            $.ajax({url:url2}).done(function(data){
              NooBox.Image.fetchFunctions[engine](cursor,result,data);
            }).fail(function(e){
              result[engine].result='failed';
              NooBox.Image.update(cursor,result);
              console.log(e);
            });
          })(cursor,engines[i]);
        }
      }  
      var url='/image.search.html?cursor='+cursor+'&image='+result.imageUrl;
      chrome.tabs.create({url:url});
      NooBox.Image.update(cursor,result);
      analytics({category:'imageSearch',action:action,label:result.imageUrl});
    });
  });
}

NooBox.Image.apiUrls={
  google:   "https://www.google.com/searchbyimage?&image_url=",
  baidu:    "http://image.baidu.com/n/pc_search?rn=10&queryImageUrl=",
  tineye:   "http://www.tineye.com/search/?url=",
  bing:     "http://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:",
  yandex:   "https://www.yandex.com/images/search?rpt=imageview&img_url=",
  saucenao: "http://saucenao.com/search.php?db=999&url=",
  iqdb:     "http://iqdb.org/?url="
};

NooBox.Image.fetchFunctions.google=function(cursor,result,data){
  try{
    data=data.replace(/<img[^>]*>/g,"");
    var page=$(data);
    var keyword=page.find('._gUb').text();
    var relatedWebsites=[];
    var relatedWebsiteList=$(page.find('#rso').find('._NId')[0]).find('.rc');
    if(relatedWebsiteList.length==0){
      relatedWebsiteList=$(page.find('#rso').find('.rgsep')[0]).prev().find('.rc');
    }
    for(var i=0;i<relatedWebsiteList.length;i++){
      var website={};
      var temp=$(relatedWebsiteList[i]);
      var x=temp.find('a')[0];
      website.link=x.href;
      website.title=x.innerText;
      var y=temp.find('.s').find('.st')[0];
      website.description=y.innerHTML;
      website.searchEngine='google';
      website.related=true;
      relatedWebsites.push(website);
    }
    var websites=[];
    var websiteList=$(page.find('#rso').find('._NId')).last().find('.rc');
    if(websiteList.length==0){
      websiteList=$(page.find('#rso').find('.rgsep')).last().prev().find('.rc');
    }
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
        var cut=website.imageUrl.indexOf('jpg%');
        if(cut!=-1){
          website.imageUrl=website.imageUrl.slice(0,cut+3);
        }
        cut=website.imageUrl.indexOf('png%');
        if(cut!=-1){
          website.imageUrl=website.imageUrl.slice(0,cut+3);
        }
        cut=website.imageUrl.indexOf('gif%');
        if(cut!=-1){
          website.imageUrl=website.imageUrl.slice(0,cut+3);
        }
      }
      website.searchEngine='google';
      websites.push(website);
    }
    result.google.keyword=keyword;
    result.google.relatedWebsites=relatedWebsites;
    result.google.websites=websites;
    result.google.result='done';
    NooBox.Image.update(cursor,result);
  }
  catch(e){
    console.log(e);
    result.google.result='failed';
    NooBox.Image.update(cursor,result);
  }
};

NooBox.Image.fetchFunctions.baidu=function(cursor,result,data){
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
      website.related=true;
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
      website.related=true;
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
      var y=temp.find('.source-card-topic-content')[0]||{};
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
    result.baidu.keyword=keyword;
    result.baidu.relatedWebsites=relatedWebsites;
    result.baidu.websites=websites;
    result.baidu.result='done';
    NooBox.Image.update(cursor,result);
  }
  catch(e){
    console.log(e);
    result.baidu.result='failed'
    NooBox.Image.update(cursor,result);
  }
};

NooBox.Image.fetchFunctions.tineye=function(cursor,result,data){
  data=data.replace(/<img[^>]*>/g,"");
  try{
    data=data.replace(/<img[^>]*>/g,"");
    var page=$(data);
    var websites=[];
    var relatedWebsites=[];
    var websiteList=$(page.find('.match'));
    for(var i=0;i<websiteList.length;i++){
      var website={};
      var temp=$(websiteList[i]);
      if(temp.find('.top-padding').length>0){
        website.title=$(temp).find('h4')[0].title;
        var x=temp.find('.top-padding').find('a')[0];
        website.link=x.href;
        website.searchEngine='tineye';
        website.description="";
        website.related=true;
        relatedWebsites.push(website);
      }
      else{
        website.title=$(temp).find('h4')[0].title;
        var x=$(temp).find('p').find('a')[2];
        website.link=x.href;
        website.description=x.href;
        var y=$(temp).find('p').find('a')[1];
        website.imageUrl=y.href;
        website.searchEngine='tineye';
        websites.push(website);
      }
    }
    result.tineye.websites=websites;
    result.tineye.relatedWebsites=relatedWebsites;
    result.tineye.result='done';
    NooBox.Image.update(cursor,result);
  }
  catch(e){
    result.tineye.result='failed';
    NooBox.Image.update(cursor,result);
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.bing=function(cursor,result,data){
  try{
    data=data.replace(/<img[^>]*>/g,"");
    var keyword=$(data).find('.query').text();
    result.bing.keyword=keyword;
    result.bing.result='done';
    NooBox.Image.update(cursor,result);
  }
  catch(e){
    result.bing.result='failed';
    NooBox.Image.update(cursor,result);
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.yandex=function(cursor,result,data){
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
    result.yandex.websites=websites;
    result.yandex.result='done';
    NooBox.Image.update(cursor,result);
  }
  catch(e){
    result.yandex.result='failed';
    NooBox.Image.update(cursor,result);
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.saucenao=function(cursor,result,data){
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
      website.related=true;
      websites.push(website);
    }
    result.saucenao.relatedWebsites=websites;
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
    result.saucenao.websites=websites;
    result.saucenao.result='done';
    NooBox.Image.update(cursor,result);
  }
  catch(e){
    result.saucenao.result='failed';
    NooBox.Image.update(cursor,result);
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.iqdb=function(cursor,result,data){
  try{
    data=data.replace(/ src=\'\/([^\/])/g," nb-src='$1");
    data=data.replace(/ src=\"\/\//g,' nb1-src="');
    data=data.replace(/ href=\"\/\//g,' nb-href="');
    var page=$(data);
    var websites=[];
    var websiteList=$(page.find('table'));
    for(var i=1;i<websiteList.length-2;i++){
      var description='<table>'+websiteList[i].innerHTML.replace(/nb-src="/g,'src="http://iqdb.org/')+'</table>';
      description=description.replace(/nb1-src="/g,'src="http://');
      description=description.replace(/nb-href="/g,'href="http://');
      var website={link:"",title:"",imageUrl:"",searchEngine:"iqdb",description:description,related:true};
      if(websiteList[i].innerHTML.indexOf("Best match")!=-1){
        result.iqdb.relatedWebsites=[website];
      }
      else{
        websites.push(website);
      }
    }
    result.iqdb.websites=[];
    result.iqdb.result='done';
    NooBox.Image.update(cursor,result);
  }
  catch(e){
    result.iqdb.result='failed';
    NooBox.Image.update(cursor,result);
    console.log(e);
  }
};

NooBox.Image.POST.general=function(cursor,result,engines,data,uploadedURL){
  if(uploadedURL){
    for(var i=0;i<engines.length;i++){
      (function(engine){
        var engine=engines[i];
        if(engine!='baidu'){
          var url=NooBox.Image.apiUrls[engine]+result.uploadedURL;
          result[engine].url=url;
          $.ajax({url:url}).done(
            NooBox.Image.fetchFunctions[engine].bind(null,cursor,result)
            ).fail(function(e){
              result[engine].result='failed';
              NooBox.Image.update(cursor,result);
              console.log(e);
            });
        }
      })(engines[i])
    }
  }
  else{
    NooBox.Image.POST.upload(cursor,result,data,NooBox.Image.POST.general.bind(null,cursor,result,engines,null));
  }
}

NooBox.Image.POST.upload=function(cursor,result,data,callback){
  var serverOrder=NooBox.Image.POST.serverOrder;
  NooBox.Image.POST.server[NooBox.Image.POST.servers[serverOrder[0]]](cursor,result,data,callback,serverOrder,0);
}

NooBox.Image.POST.server['chuantu.biz']=function(cursor,result,data,callback,serverOrder,i){
  var formData=new FormData();
  formData.append('uploadimg',dataURItoBlob(data),'NooBox.jpg');
  $.ajax({
    type:'POST',
    url:'http://www.chuantu.biz/upload.php',
    contentType: false,
    processData: false,
    data: formData
  }).done(function(data){
    console.log(data);
    data=data.replace(/ src=/g," nb-src=");
    var url=$(data).find('input').attr("value");
    result.uploadedURL=url||"";
    NooBox.Image.POST.serverOrder=serverOrder.concat(serverOrder.splice(0,i));
    callback(result.uploadedURL);
  }).fail(function(err){
    if(i<NooBox.Image.POST.servers.length-1){
      console.log('next server');
      NooBox.Image.POST.server[NooBox.Image.POST.servers[serverOrder[++i]]](cursor,result,data,callback,serverOrder,i);
    }
    else{
      console.log(err);
      chrome.notifications.create('uploadServer',{
        type:'basic',
        iconUrl: '/images/icon_128.png',
        title: GL("upload_image"),
        message: GL("NooBox_cannot_reach_image_uploading_server")
      },function(){});
    }
  });
}

NooBox.Image.POST.server['postimage.org']=function(cursor,result,data,callback,serverOrder,i){
  var formData=new FormData();
  formData.append('upload',dataURItoBlob(data),'NooBox');
  $.ajax({
    type:'POST',
    url:'http://old.postimage.org/index.php',
    contentType: false,
    processData: false,
    data: formData
  }).done(function(data){
    data=data.replace(/ src=/g," nb-src=");
    var url=$(data).find('.gallery').find('img').attr("nb-src");
    result.uploadedURL=url||"";
    NooBox.Image.POST.serverOrder=serverOrder.concat(serverOrder.splice(0,i));
    callback(result.uploadedURL);
  }).fail(function(err){
    if(i<NooBox.Image.POST.servers.length-1){
      console.log('next server');
      NooBox.Image.POST.server[NooBox.Image.POST.servers[serverOrder[++i]]](cursor,result,data,callback,serverOrder,i);
    }
    else{
      console.log(err);
      chrome.notifications.create('uploadServer2',{
        type:'basic',
        iconUrl: '/images/icon_128.png',
        title: GL("upload_image"),
        message: GL("NooBox_cannot_reach_image_uploading_server")
      },function(){});
    }
  });
}

NooBox.Image.POST.baidu=function(cursor,result,data){
  $.ajax({
    type:'POST',
    url:'http://stu.baidu.com/i?appid=4&appname=extend.chrome.capture&rt=0&rn=10&ct=0&stt=0&tn=shituresult',
    contentType:'multipart/form-data; boundary=----WebKitFormBoundary',
    data:NooBox.Image.DataWrapper.baidu({data:data,name:'dragimage'},'----WebKitFormBoundary')
  }).done(function(data){
    result.baidu.url=data;
    $.ajax({url:data}).done(NooBox.Image.fetchFunctions.baidu.bind(null,cursor,result));
  }).fail(function(){
    result.baidu.result='failed'
    NooBox.Image.update(cursor,result);
  });
}

NooBox.Image.DataWrapper.baidu=function(binaryData, boundary, otherParameters) {
  var commonHeader = 'Content-Disposition: form-data; ';
  var data = [];
  data.push('--' + boundary + '\r\n');
  data.push(commonHeader);
  data.push('name="image";filename=""\r\n');
  data.push('Content-Type: application/octet-stream\r\n\r\n\r\n');
  data.push('--' + boundary + '\r\n');
  data.push(commonHeader);
  data.push('name="' + (binaryData.name || 'binaryfilename') + '"; \r\n\r\n');
  data.push(binaryData.data + '\r\n');
  data.push('--' + boundary + '--\r\n');
  return data.join('');
}


NooBox.Image.update=function(i,result){
  setDB('NooBox.Image.result_'+i,
    result,
    function(){
      chrome.runtime.sendMessage({job:'image_result_update',cursor:i}, function(response) {});
    }
  );
}


NooBox.Image.extractImages=function(info,tab){
  chrome.tabs.sendMessage(tab.id,{job:"extractImages"},{frameId:info.frameId},function(response){
    if(!response){
      chrome.notifications.create('extractImages',{
        type:'basic',
        iconUrl: '/images/icon_128.png',
        title: chrome.i18n.getMessage("extractImages"),
        message: chrome.i18n.getMessage("ls_4")
      },function(){});
    }
  });
}

NooBox.Image.screenshotSearch=function(info,tab){
  chrome.tabs.sendMessage(tab.id,'loaded',function(response){
    console.log(response);
    if(response=='yes'){
      chrome.tabs.captureVisibleTab(tab.windowId,function(dataURL){
        chrome.tabs.sendMessage(tab.id,{job:"screenshotSearch",data:dataURL});
      });
    }
    else{
      chrome.tabs.captureVisibleTab(tab.windowId,function(dataURL){
          chrome.tabs.executeScript(tab.id,{file:'thirdParty/jquery.min.js'},function(){
            if(chrome.runtime.lastError){
              chrome.notifications.create('screenshotFailed',{
                type:'basic',
                iconUrl: '/images/icon_128.png',
                title: GL("ls_1"),
                message: GL("ls_2")
              },voidFunc);
              return;
            }
            chrome.tabs.executeScript(tab.id,{
              file: 'js/screenshotSearch.js'
            },function(){
              chrome.tabs.sendMessage(tab.id,{job:"screenshotSearch",data:dataURL});
            });
          });
      });
    }
  });
}

NooBox.History.recordImageSearch=function(cursor,info){
  getDB('history_records',function(records){
    records=records||[];
    var source=info.srcUrl||info;
    records.push({date:new Date().getTime(),event:'search',cursor:cursor,info:source});
    setDB('history_records',records);
    get('totalImageSearch',function(data){
      data=data||0;
      set('totalImageSearch',parseInt(data)+1);
    });
  });
}

NooBox.init=function(){
  NooBox.Options.init(0);
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if('job' in request){
        if (request.job=="imageSearch_upload"){
          NooBox.Image.imageSearch(request.data);
        }
        else if(request.job=='imageSearch'||request.job=='extractImages'||request.job=='screenshotSearch'){
          NooBox.Image.updateContextMenu();
        }
        else if(request.job=='analytics'){
          console.log(request);
          analytics(request);
        }
      }
    }
  );
}

document.addEventListener('DOMContentLoaded', NooBox.init);
