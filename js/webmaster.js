document.addEventListener('DOMContentLoaded', function(){
  alert('still testing');
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.job=='webmaster_sitemap_update'){
        console.log(request.data);
        var obj=JSON.parse(request.data);
        $('#sitemap')[0].value=obj.sitemap;
        $('#brokenLinks')[0].value=obj.brokenLinks;
        $('#status').text(obj.finished+'/'+obj.total);
        console.log('oh');
      }
    });
  $('#crawl').click(function(){
    var obj={};
    obj.host=$('#host')[0].value;
    obj.path=$('#path')[0].value;
    obj.maxDepth=$('#maxDepth')[0].value;
    console.log('click');
    chrome.runtime.sendMessage({job:'webmaster_sitemap_get',data: JSON.stringify(obj)});
  });
});

