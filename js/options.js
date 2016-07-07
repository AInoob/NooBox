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
    if(isOn(checkList[i].id)){
      checkList[i].checked=true;
    }
  }
}


document.addEventListener('DOMContentLoaded', function(){
	init();
});

function turnOn(key){
  localStorage.setItem(key,'1');
}


function turnOff(key){
  localStorage.setItem(key,'-1');
}

function isOn(key){
  return localStorage.getItem(key)=='1';
}

function setItem(key,value){
  localStorage.setItem(key,value);
}

function getItem(key){
  localStorage.getItem(key);
}

