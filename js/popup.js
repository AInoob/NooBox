$('.switch').each(function(index,element){
  isOn(element.id,function(){
    element.checked=true;
    updateSubSection.bind(element)(true);
  },function(){
    element.checked=false;
    updateSubSection.bind(element)(false);
  });
  $(element).change(function(){
    if(this.checked){
      set(element.id,'1',setOn.bind(element));
    }
    else{
      set(element.id,'-1',setOff.bind(element));
    }
  });
});

document.addEventListener('DOMContentLoaded', function(){
  $('#upload').on('change',upload);
  $('#uploadLabel').on('dragover',drag);
  $('#uploadLabel').on('drop',drop);
  updateBackgroundImage();
});

var drag=function(e){
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer = e.originalEvent.dataTransfer;
  e.dataTransfer.dropEffect = 'copy';
}

var drop=function(e){
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer = e.originalEvent.dataTransfer;
  var url=URL.createObjectURL(e.dataTransfer.files[0]);
  $('#image').attr('src',url);
  fetchBlob(url, function(blob) {
    reader.readAsDataURL(blob);
  });
}

var updateBackgroundImage=function(){
  getDB('NooBox.Configuration.popupBackground',function(data){
    $('body').css('background-image','url('+data+')');
  });
}

var upload=function(e){
  var url=URL.createObjectURL(e.target.files[0]);
  $('#image').attr('src',url);
  fetchBlob(url, function(blob) {
    reader.readAsDataURL(blob);
  });
}


var setOn=function(){
  updateSubSection.bind(this)(true);
  chrome.extension.sendMessage({job: this.id}, function() {});
  chrome.tabs.query({}, function(allTabs) {
    for(i in allTabs){
      chrome.tabs.sendMessage(allTabs[i].id, {job: this.id}, function() {});
    }
  });
}

var setOff=function(){
  updateSubSection.bind(this)(false);
  chrome.extension.sendMessage({job: this.id}, function() {});
  chrome.tabs.query({}, function(allTabs) {
    for(i in allTabs){
      chrome.tabs.sendMessage(allTabs[i].id, {job: this.id}, function() {});
    }
  });
}

updateSubSection=function(display){
  var hasSub=false;
  for(i in this.classList){
    if(this.classList[i]=='hasSub'){
      hasSub=true;
    }
  }
  if(hasSub){
    if(display)
      $(this).parent().nextAll().show();
    else
      $(this).parent().nextAll().hide();
  }
}

function isOn(key,callbackTrue,callbackFalse){
  get(key,function(value){
    if(value=='1'){
      if(callbackTrue){
        callbackTrue();
      }
    }
    else{
      if(callbackFalse){
        callbackFalse();
      }
    }
  });
}

function setIfNull(key,setValue,callback,callbackCallback){
  get(key,function(value){
    if(!value){
      set(key,setValue,callback);
    }
    else{
      if(callback)
        callback(callbackCallback);
    }
  });
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

var reader = new window.FileReader();
reader.onloadend = function() {
 base64data = reader.result;                
 chrome.extension.sendMessage({job: 'image_search_upload',data:base64data });
}

function setDB(key,value,callback){
  localStorage.setItem(key,value);
  callback();
}

function getDB(key,callback){
  if(callback){
    callback(localStorage.getItem(key));
  }
}
