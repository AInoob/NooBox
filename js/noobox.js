init=function(){
  $('.word').each(function(index,element){
    console.log(element);
    element.innerHTML=chrome.i18n.getMessage(element.getAttribute('word'));
  });
}

document.addEventListener( "DOMContentLoaded", init, false );
