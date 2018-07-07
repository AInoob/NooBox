import data from './data';
import { logEvent } from '../utils/bello';
import GL from '../utils/getLocale';
import { get } from '../utils/db';
import { fetchBlob, convertDataURIToBinary } from '../utils';
import imageUtil from '../utils/imageSearchUtils.js';
import ajax from '../utils/ajax.js';
export default class Image {
  constructor() {}
  async init() {
    if (await get('extractImages')) {
      data.Image.extractImageHandle = browser.contextMenus.create({
        "id": "extractImages",
        "title": GL("extract_images"),
        "contexts": ["all"],
        "onclick": this.extractImages
      });
    }else {
      browser.contextMenus.remove(data.Image.extractImageHandle);
      data.Image.extractImageHandle = null;
    }
  }
  extractImages(info, tab) {
    try {
      browser.tabs.sendMessage(tab.id, {
        job: "extractImages"
      }, {
          frameId: info.frameId
        }, (response) => {
          if (!response) {
            browser.notifications.create('extractImages', {
              type: 'basic',
              iconUrl: '/static/nooboxLogos/icon_128.png',
              title: GL("extractImages"),
              message: GL("ls_4")
            }, () => {});
          }
        });
    } catch (e) {
      browser.tabs.sendMessage(tab.id, {
        job: "extractImages"
      }, (response) => {
        if (!response) {
          brwoser.notifications.create('extractImages', {
            type: 'basic',
            iconUrl: '/static/nooboxLogos/icon_128.png',
            title: GL("extractImages"),
            message: GL("ls_4")
          }, () => {});
        }
      });
    }
  }
  downloadExtractImages(sender, files) {
    logEvent({
      category: 'downloadExtractImages',
      action: 'run'
    });
    const zip = new JSZip();
    let remains = files.length;
    let total = files.length;
    let i = 0;
    let file = files[i];
    console.log(file);
    const reader = new window.FileReader();
    reader.onloadend = () => {
      console.log(remains);
      addImage(reader.result);
    }
    function addImage(dataURI) {
      if (dataURI) {
        const ext = (dataURI.slice(0, 20).match(/image\/(\w*)/) || ['', ''])[1];
        const binary = convertDataURIToBinary(dataURI);
        console.log(binary);
        zip.file(file.name + '.' + ext, binary, {
          base64: false
        });
      }
      else {
        total--;
      }
      remains--;
      chrome.tabs.sendMessage(sender.tab.id, {
        job: 'downloadRemaining',
        remains: remains,
        total: total
      }, () => { });
      if (remains == 0) {
        zip.generateAsync({
          type: 'blob'
        }).then((content) => {
          saveAs(content, 'NooBox.zip');
        });
      } else {
        file = files[++i];
        if (file.url.slice(0, 4) == 'data') {
          addImage(file.url);
        } else {
          fetchBlob(file.url, (blob) => {
            if (blob) {
              reader.readAsDataURL(blob);
            }
            else {
              addImage();
            }
          });
        }
      }
    }
    if (file.url.slice(0, 4) == 'data') {
      addImage(file.url);
    } else {
      fetchBlob(file.url, (blob) => {
        if (blob) {
          reader.readAsDataURL(blob);
        }
        else {
          addImage();
        }
      });
    }
  }
  async beginImageSearch(base64){
    let aionobServer = "https://ainoob.com/api/uploadImage/";
    let requestBody  = {
      method: 'POST',  
      headers: {
        //'User-Agent': 'Mozilla/4.0 MDN Example',
        'Content-Type': 'application/json'
      },
      mode:"cors",
      body: JSON.stringify({data:base64}),
    }
    let result = await ajax(aionobServer, requestBody);
    console.log(result);
  }
}
