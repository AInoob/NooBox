let beyondCtx = null;
document.addEventListener("DOMContentLoaded", () => {
  isOn('videoControl', () => {
    $('body').append('<div id="NooBox-VideoBeyond" style="position:fixed;left:0;top:0"><canvas style="width:800px;height:500px" id="NooBox-VideoBeyond-canvas"></canvas></div>');
    const canvas = $('#NooBox-VideoBeyond-canvas')[0];
    const ctx = canvas.getContext('2d');
    beyondCtx = ctx;
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        if (request.job == 'videoBeyond') {
          let prev = request.prev;
          temp = new Date().getTime();
          console.log('4 getMessage: ' + (temp - prev));
          const img = new Image;
          img.src = request.dataURI;
          temp = new Date().getTime();
          console.log('5 image: ' + (temp - prev));
          ctx.drawImage(img, 0, 0);
          temp = new Date().getTime();
          console.log('6 done: ' + (temp - prev));
          prev = temp;
        }
      }
    );
  });
});
