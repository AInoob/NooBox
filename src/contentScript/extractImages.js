if (window.browser) {
  window.chrome = window.browser;
}

function get(key, callback) {
  chrome.storage.sync.get(key, function(result) {
    if (callback) callback(result[key]);
  });
}

function isOn(key, callbackTrue, callbackFalse, param) {
  get(key, function(value) {
    if (value == '1') {
      if (callbackTrue) {
        callbackTrue(param);
      }
    } else {
      if (callbackFalse) {
        callbackFalse(param);
      }
    }
  });
}

let imgSet = {};
const notImgSet = {};
const isImgSet = {};
let focus = null;

function getImages() {
  const linkImage = $('#linkImage').prop('checked');
  let notification = false;
  const val = $('#NooBox-extractImages-selector-range').val();
  const gallery = $('#NooBox-extractImages-gallery')[0];
  $(gallery).empty();
  imgSet = {};
  let tempFocus2 = focus;
  for (let i = 1; i < val; i++) {
    tempFocus2 = $(tempFocus2).parent()[0];
  }
  const getAllImgs = function(elem) {
    $(elem)
      .find('*')
      .each(function() {
        if (this.tagName == 'IMG') {
          imgSet[this.src] = true;
        } else {
          const bg = $(this).css('background-image');
          if (bg) {
            const url = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            imgSet[url] = true;
          }
        }
        if (linkImage && this.tagName == 'A') {
          if (isImgSet[this.href] == true) {
            imgSet[this.href] = true;
          } else {
            if (!notImgSet[this.href] == true) {
              getValidImage(this.href);
            }
          }
        }
        if (this.tagName == 'IFRAME') {
          if (!notification) {
            notification = true;
          }
          //getAllImgs(this.contentDocument);
        }
      });
  };
  getAllImgs(tempFocus2);
  Object.keys(imgSet).forEach(function(elem) {
    $(gallery).append(
      '<div style = "width: 20%; ' +
      'margin: 20px;' +
      'border: 1px dashed #ffffff;' +
      '" >' +
      '<img src="' +
      elem +
      '" style="margin:0px;border:0px;padding:0px;max-width:100%;" />' +
      '</div>',
    );
  });
  //location.href = "#NooBox-extractImages-selector-range";
}

function getValidImage(url) {
  if (url && url.length > 0 && !notImgSet[url] == true) {
    const img = $('<img src="' + url + '">');
    $(img).on('error', function() {
      notImgSet[url] = true;
    });
    $(img).on('load', function() {
      if (!imgSet[url] == true) {
        const gallery = $('#NooBox-extractImages-gallery')[0];
        imgSet[url] = true;
        isImgSet[url] = true;
        $(gallery).append(
          '<div style = "max-width: 10%">' +
          '<img src="' +
          url +
          '" style="margin:0px;border:0px;padding:0px;max-width:100%;" />' +
          '</div>',
        );
      }
    });
  }
}

window.oncontextmenu = function(e) {
  focus = e.target;
};
const initExtractImage = function() {
  isOn('extractImages', function() {
    chrome.runtime.onMessage.addListener(function(
      request,
      sender,
      sendResponse,
    ) {
      if (request.job) {
        if (request.job == 'extractImages') {
          $(document.head).append(
            '<style>#NooBox-extractImages,#NooBox-extractImages *{margin:0;padding:0;border-radius:0;background:none}input[type="checkbox"] ~ .inputLabel{cursor:pointer;position:absolute;margin-top: -18px !important;margin-left: 19px !important;width: 174px;height: 28px;border: 4px solid transparent;border-bottom: 4px solid #5667bb;-webkit-transform: rotate(4deg);transform: rotate(4deg);}input[type="checkbox"]:checked ~ .inputLabel{margin-top:-12px;margin-left:163px;width: 18px;height: 38px;border: 4px solid transparent;border-right: 4px solid #5667bb;border-bottom: 4px solid #5667bb;-webkit-transform: rotate(40deg);transform: rotate(40deg);}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none!important;background-color:#E9E9E9;border:1pxsolid#CECECE;height:15px;width:15px;}#NooBox-extractImages-downloadRemaining{color:white;float:left}</style>',
          );
          if (!focus || focus.tagName == 'HTML') {
            focus = document.body;
          }
          sendResponse({
            success: true,
          });
          chrome.runtime.sendMessage(
            {
              job: 'analytics',
              value: {
                category: 'extractImage',
                action: 'run',
              }
            },
            function(response) {},
          );
          const images = [];
          const height = window.innerHeight - 66;
          const width = window.innerWidth;
          const div = $('<div id="NooBox-extractImages">').css({
            'z-index': '999999999999999999999',
            height: '100%',
            overflow: 'auto',
            'background-color': 'rgba(153,153,153,0.8)',
            padding: '50px 100px 0 100px',
            position: 'fixed',
            width: '1000px',
            margin: ' 0 auto',
            top: 0,
            left: 0,
            right: 0,
          });
          let max = 1;
          let tempFocus = focus;
          while (tempFocus.tagName != 'BODY') {
            tempFocus = $(tempFocus).parent()[0];
            max++;
          }
          div.append(
            '<div style = "' +
            'position: absolute;' +
            'top: 10%;' +
            'left: 120px;' +
            'width: 40%;' +
            '">' +
            '<div style = "width: 40%; display:inline-block; margin-right: 30px">' +
            '<h3 style ="' +
            'margin-bottom: 10px;' +
            'font-size: 18px;' +
            'font-family: courier, Monaco;' +
            '">' +
            chrome.i18n.getMessage('extract_range') +
            '</h3>' +
            '<input ' +
            'style = "' +
            '-webkit-appearance: none;' +
            'appearance: none;' +
            'width: 100%;' +
            'height: 16px;' +
            'background: #d3d3d3;' +
            'outline: none;' +
            'opacity: 0.7;' +
            '-webkit-transition: .2s;' +
            'transition: opacity .2s;' +
            'border: 1px solid black !important' +
            '"' +
            'type= "range" ' +
            'id="NooBox-extractImages-selector-range"' +
            'value="1"' +
            'min="1" ' +
            'max="' +
            max +
            '" step="1">' +
            '</div>' +
            '<div style = "width: 40%; display:inline-block; margin-right: 30px">' +
            '<svg ' +
            'id = "NooBox-extractImages-download"' +
            'height= "24px" ' +
            'width = "24px" ' +
            'data-icon="download" ' +
            'viewBox="0 0 512 512" ' +
            'cursor = "pointer"' +
            '>' +
            '<path fill="currentColor" ' +
            'd="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z" class="">' +
            '</path>' +
            '</svg>' +
            '</div>' +
            '</div>',
          );
          div.append(
            '<svg ' +
            'id="NooBox-extractImages-switch"' +
            'width="32px" ' +
            'height="32px"' +
            'viewBox="0 0 352 512"' +
            'style ="position: absolute;' +
            'top: 10%;' +
            'right: 10%;' +
            '">' +
            '<path fill="black" ' +
            'd="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z">' +
            '</path>' +
            '</svg>',
          );
          if (focus.tagName != 'BODY' && focus.tagName != 'HTML')
            focus = $(focus).parent()[0];
          const div2 = $(
            '<div ' +
            'id="NooBox-extractImages-gallery" ' +
            'style="' +
            'border:0px;' +
            'padding:0px;' +
            'width:100%;' +
            'display: flex;' +
            'flex-direction: row;' +
            'flex-wrap: wrap;' +
            'margin-top:15%"></div>',
          );
          div.append(div2);
          $(document.body).append(div);
          getImages();
          $('body').on('keyup', function(e) {
            console.log(e.keyCode);
            if (e.keyCode === 27) {
              $(div).remove();
            }
          });
          $('#NooBox-extractImages-selector-left').on('click', function(e) {
            let val = parseInt($('#NooBox-extractImages-selector-range').val());
            val--;
            $('#NooBox-extractImages-selector-range').val(val);
            getImages();
          });
          $('#NooBox-extractImages-selector-right').on('click', function(e) {
            let val = parseInt($('#NooBox-extractImages-selector-range').val());
            val++;
            $('#NooBox-extractImages-selector-range').val(val);
            getImages();
          });
          $('#NooBox-extractImages-selector-range').on('change', function(e) {
            getImages();
          });
          $('#NooBox-extractImages-switch').on('click', function(e) {
            $('#NooBox-extractImages').remove();
          });
          $('#NooBox-extractImages-download').on('click', function(e) {
            const files = [];
            Object.keys(imgSet).forEach(function(elem, index) {
              let i = index;
              files.push({
                name: i,
                url: elem,
              });
            });
            chrome.runtime.sendMessage(
              {
                job: 'urlDownloadZip',
                value: {
                  files: files,
                }
              },
              function(response) {},
            );
          });
          $('#linkImageLabel').on('click', function(e) {
            getImages();
          });
        } else if (request.job == 'downloadRemaining') {
          $('#NooBox-extractImages-downloadRemaining').text(
            request.total - request.remains + '/' + request.total,
          );
        }
      }
    });
  });
};
initExtractImage();