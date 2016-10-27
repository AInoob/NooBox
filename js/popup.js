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
 //To-do
 if(false){
   chrome.notifications.create({
     type:'basic',
     iconUrl: '/images/icon_128.png',
     title: chrome.i18n.getMessage("Reverse_Image_Search"),
     message: chrome.i18n.getMessage("Not_An_Image_Type")
   });
 }
 else{
   chrome.extension.sendMessage({job: 'image_search_upload',data:base64data });
 }
}

