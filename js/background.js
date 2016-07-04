var NooBox=NooBox||{};
NooBox.Image={};
NooBox.Image.apis=[
  "https://www.google.com/searchbyimage?&image_url=",
  "http://image.baidu.com/n/pc_search?rn=10&queryImageUrl=",
  "http://www.tineye.com/search/?url=",
  "http://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:"
];
NooBox.Image.imageFromUrl=function(info,tab){
  console.log(info);
  console.log(tab);
  for(var i=0;i<NooBox.Image.apis.length;i++){
    url=NooBox.Image.apis[i]+info.srcUrl;
    /*$.ajax({url:url}).done(function(data){
      console.log(data.length);
    }).fail(function(error){
      console.log(error);
    });
    */
    chrome.tabs.create({url:url});
  }
}


chrome.contextMenus.create({
  "title": "Search this Image",
  "contexts": ["image"],
  "onclick": NooBox.Image.imageFromUrl
});
