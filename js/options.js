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
  $('#imageSearchBackground').on('change',function(e){
    currentFocus="NooBox.Image.background";
    updateBackground(e);
  });
  $('#labelImageSearchBackground').on('dragover',function(e){
    currentFocus="NooBox.Image.background";
    drag(e);
  });
  $('#labelImageSearchBackground').on('drop',function(e){
    currentFocus="NooBox.Image.background";
    drop(e);
  });
  $('#clearImageSearchBackground').on('click',function(e){
    currentFocus="NooBox.Image.background";
    $('#imageSearchBackground').val('');
    clearBackground(e);
  });
  $('#popupBackground').on('change',function(e){
    currentFocus="NooBox.Configuration.popupBackground";
    updateBackground(e);
  });
  $('#labelPopupBackground').on('dragover',function(e){
    currentFocus="NooBox.Configuration.popupBackground";
    drag(e);
  });
  $('#labelPopupBackground').on('drop',function(e){
    currentFocus="NooBox.Configuration.popupBackground";
    drop(e);
  });
  $('#clearPopupBackground').on('click',function(e){
    currentFocus="NooBox.Configuration.popupBackground";
    $('#popupBackground').val('');
    clearBackground(e);
    clearBackground(e);
  });
  updateBackgroundImage();
});
var currentFocus;

var clearBackground=function(){
  setDB(currentFocus,
  '',
  function(){
    updateBackgroundImage();
  });
}

var updateBackgroundImage=function(){
  getDB('NooBox.Image.background',function(data){
    $('#imageSearchBackgroundImage').attr('src',data);
  });
  getDB('NooBox.Configuration.popupBackground',function(data){
    $('#popupBackgroundImage').attr('src',data);
  });
}

var drag=function(e){
  console.log(currentFocus);
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer = e.originalEvent.dataTransfer;
  e.dataTransfer.dropEffect = 'copy';
}

var drop=function(e){
  console.log(currentFocus);
  e.stopPropagation();
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer = e.originalEvent.dataTransfer;
  var url=URL.createObjectURL(e.dataTransfer.files[0]);
  fetchBlob(url, function(blob) {
    reader.readAsDataURL(blob);
  });
}

var updateBackground=function(e){
  console.log(e);
  var url=URL.createObjectURL(e.target.files[0]);
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
  setDB(currentFocus,
    base64data,
    function(){
      updateBackgroundImage();
    }
  );
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
