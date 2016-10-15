document.addEventListener('DOMContentLoaded', function(){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if('webmaster_sitemap' in request){
        console.log(request.webmaster_sitemap);
        var obj=JSON.parse(request.webmaster_sitemap);
        $('#sitemap')[0].value=obj.sitemap;
        $('#brokenLinks')[0].value=obj.brokenLinks;
        $('#status').text(obj.finished+'/'+obj.total);
        //$('#sitemap')[0].value=obj.sitemap;
      }
    });
  $('#crawl').click(function(){
    var obj={};
    obj.host=$('#host')[0].value;
    obj.path=$('#path')[0].value;
    obj.maxDepth=$('#maxDepth')[0].value;
    obj.job='getSitemap';
    chrome.runtime.sendMessage({webmaster: JSON.stringify(obj)}, function(response) {});
  });
});

