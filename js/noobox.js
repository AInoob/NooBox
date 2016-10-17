init=function(){
  $('.word').each(function(index,element){
    element.innerHTML=chrome.i18n.getMessage(element.getAttribute('word'));
  });
}

document.addEventListener( "DOMContentLoaded", init, false );

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-77112662-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
