var shared={};

var timeagoInstance=null;

var isZh=false;

chrome.i18n.getAcceptLanguages(function(data){
  if(data.indexOf('zh')!=-1){
    isZh=true;
  }
})

function initTimeago(){
  if(isZh){
    timeago.register('locale', function(number, index) {
      return [
      ['刚刚', '片刻后'],
      ['%s秒前', '%s秒后'],
      ['1分钟前', '1分钟后'],
      ['%s分钟前', '%s分钟后'],
      ['1小时前', '1小时后'],
      ['%s小时前', '%s小时后'],
      ['1天前', '1天后'],
      ['%s天前', '%s天后'],
      ['1周前', '1周后'],
      ['%s周前', '%s周后'],
      ['1月前', '1月后'],
      ['%s月前', '%s月后'],
      ['1年前', '1年后'],
      ['%s年前', '%s年后']
      ][index];
    });
  }
  timeagoInstance=new timeago();
}

//Sorting strings without case sensitivity
function compare(a,b){
  var cursor=0;
  var lenA=a.length;
  var lenB=b.length;
  var aa=a.toLowerCase();
  var bb=b.toLowerCase();
  var tempA,tempB;
  while(lenA>cursor&&lenB>cursor){
    tempA=aa.charCodeAt(cursor);
    tempB=bb.charCodeAt(cursor);
    if(tempA==tempB){
      cursor++;
      continue;
    }
    else{
      return tempA-tempB;
    }
  }
  return lenA-lenB;
}

function getLocale(string){
  return chrome.i18n.getMessage(string);
}

var GL=getLocale;

function getChromeVersion(){
  var match = window.navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9\.]+)/);
  return match ? match[1] : null;
}

//get xxx.com
function extractDomain(url) {
  if(!url){
    return 'error';
  }
  var domain;
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  }
  else {
    domain = url.split('/')[0];
  }
  domain = domain.split(':')[0];
  var list=domain.split('.');
  return list[list.length-2]+'.'+list[list.length-1];
}

function capFirst(elem){
  str=getString(elem);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getString(elem){
  if(elem===undefined||elem===null){
    return '';
  }
  else{
    return elem.toString();
  }
}

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function dataUrlFromUrl(link, callback){
  var img=new Image();
  img.addEventListener('load',function(){
    var canvas=document.createElement("canvas");
    canvas.width=img.width;
    canvas.height=img.height;
    var ctx=canvas.getContext('2d');
    ctx.drawImage(img,0,0,img.width,img.height);
    var dataUrl=canvas.toDataURL();
    callback(dataUrl);
  });
  img.src=link;
}

function isOn(key,callbackTrue,callbackFalse,param){
  get(key,function(value){
    if(value=='1'||value==true){
      if(callbackTrue){
        callbackTrue(param);
      }
    }
    else{
      if(callbackFalse){
        callbackFalse(param);
      }
    }
  });
}

function setIfNull(key,setValue,callback){
  get(key,function(value){
    if(value==undefined||value==null){
      set(key,setValue,callback);
    }
    else{
      if(callback){
        callback();
      }
    }
  });
}

function setDB(key,value,callback){
  var indexedDB = window.indexedDB;
  var open = indexedDB.open("NooBox", 1);
  open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("Store", {keyPath: "key"});
  };
  open.onsuccess = function() {
    var db = open.result;
    var tx = db.transaction("Store", "readwrite");
    var store = tx.objectStore("Store");
    var action1=store.put({key:key, value:value});
    action1.onsuccess=function(){
      if(callback){
        callback();
      }
    }
    action1.onerror=function(){
      console.log('setDB fail');
    }
  }
}

function getDB(key,callback){
  if(callback){
    var indexedDB = window.indexedDB;
    var open = indexedDB.open("NooBox", 1);
    open.onupgradeneeded = function() {
      var db = open.result;
      var store = db.createObjectStore("Store", {keyPath: "key"});
    };
    open.onsuccess = function() {
      var db = open.result;
      var tx = db.transaction("Store", "readwrite");
      var store = tx.objectStore("Store");
      var action1=store.get(key);
      action1.onsuccess=function(e){
        if(e.target.result){
          callback(e.target.result.value);
        }
        else{
          callback(null);
        }
      }
      action1.onerror=function(){
        console.log('getDB fail');
      }
    }
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

function getImageSearchEngines(list,callback,i,result,shared){
  if(i==null){
    i=-1;
    shared=[];
  }
  else{
    if(result){
      shared.push(list[i]);
    }
    if(i==list.length-1){
      callback(shared);
    }
  }
  if(i<list.length-1){
    isOn("imageSearchUrl_"+list[i+1],getImageSearchEngines.bind(null,list,callback,i+1,true,shared),getImageSearchEngines.bind(null,list,callback,i+1,false,shared));
  }
}

function dataURItoBlob(dataURI) {
  try{
    var byteString = atob(dataURI.split(',')[1]);
  }catch(e){
    console.log(e);
  }
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}

function loadIframe(url,callback){
  $(function(){
    var ifr=$('<iframe/>', {
      id:'baiduIframe',
      src:url,
      style:'display:none',
    });
    $('#baiduIframe').on('load',callback );
    $('body').append(ifr);    
  });
}

function voidFunc(){
}

function fetchBlob(uri, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', uri, true);
  xhr.responseType = 'blob';

  xhr.onload = function(e) {
    if (this.status == 200) {
      var blob = new Blob([this.response], {type: 'image/png'});;
      if (callback) {
        callback(blob);
      }
    }
  };
  xhr.send();
};
