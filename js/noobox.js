init=function(){
  $('.word').each(function(index,element){
    if(element.tagName=="TITLE"){
      element.innerHTML=capFirst(chrome.i18n.getMessage(element.getAttribute('word')));
    }
    else{
      element.innerHTML=chrome.i18n.getMessage(element.getAttribute('word'));
    }
  });
  sayHiToAInoob();
}

document.addEventListener( "DOMContentLoaded", init, false );

var capFirst=function(word){
  return word[0].toUpperCase()+word.slice(1);
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-77112662-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var sayHiToAInoob=function(){
  get('userId',function(userId){
    var hi={
      userId:userId,
      url:window.location.pathname+window.location.search,
      title:document.title,
      time:new Date().toLocaleString(),
      version: "0.4.3"
    };
    $.ajax({
      type:'POST',
      url:"https://ainoob.com/api/noobox/user/",
      data: hi
    }).done(function(data){
      console.log(data);
    });
  });
}

function isOn(key,callbackTrue,callbackFalse,param){
  get(key,function(value){
    if(value=='1'){
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
    if(!value){
      set(key,setValue,callback);
    }
    else{
      if(callback)
        callback();
    }
  });
}

function setDB(key,value,callback){
  var indexedDB = window.indexedDB;
  var open = indexedDB.open("NooBox", 1);
  open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("Store", {keyPath: "key"});
    //var index = store.createIndex("keyIndex", ["key"]);
  };
  open.onsuccess = function() {
    var db = open.result;
    var tx = db.transaction("Store", "readwrite");
    var store = tx.objectStore("Store");
    //var index = store.index("keyIndex");
    var action1=store.put({key:key, value:value});
    action1.onsuccess=function(){
      console.log('setDB done');
      callback();
    }
    action1.onerror=function(){
      console.log('setDB fail');
    }
  }
  //localStorage.setItem(key,value);
}

function getDB(key,callback){
  if(callback){
    var indexedDB = window.indexedDB;
    var open = indexedDB.open("NooBox", 1);
    open.onupgradeneeded = function() {
      var db = open.result;
      var store = db.createObjectStore("Store", {keyPath: "key"});
      //var index = store.createIndex("keyIndex", ["key"]);
    };
    open.onsuccess = function() {
      var db = open.result;
      var tx = db.transaction("Store", "readwrite");
      var store = tx.objectStore("Store");
      //var index = store.index("keyIndex");
      var action1=store.get(key);
      action1.onsuccess=function(e){
        console.log('getDB done');
        callback(e.target.result.value);
      }
      action1.onerror=function(){
        console.log('getDB fail');
      }
    }
    //callback(localStorage.getItem(key));
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

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
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
