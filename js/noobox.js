init=function(){
  $('.word').each(function(index,element){
    console.log(element.getAttribute('word'));
    if(element.tagName=="TITLE"){
      element.innerHTML=capFirst(chrome.i18n.getMessage(element.getAttribute('word')));
    }
    else{
      element.innerHTML=chrome.i18n.getMessage(element.getAttribute('word'));
    }
  });
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
