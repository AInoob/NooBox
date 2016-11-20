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
      version: "0.6.1"
    };
    $.ajax({
      type:'POST',
      url:"https://ainoob.com/api/noobox/user/",
      contentType: "application/json",
      data: JSON.stringify(hi)
    }).done(function(data){
      console.log(data);
    });
  });
}

document.addEventListener( "DOMContentLoaded", sayHiToAInoob, false );
