function init(){
  $('.check').change(function(){
    if(this.checked){
      turnOn(this.id);
    }
    else{
      turnOff(this.id);
    }
  });
  var checkList=$('.check');
  for(var i=0;i<checkList.length;i++){
    isOn(checkList[i].id,checkItem.bind(null,checkList[i]));
  }
}


document.addEventListener('DOMContentLoaded', function(){
  init();
});

function turnOn(key){
  set(key,'1');
}


function turnOff(key){
  set(key,'-1');
}

function checkItem(item){
  item.checked=true;
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
