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
    await this.updateExtractImageContextMenu();
    await this.updateImageSearchContextMenu();
    await this.updateScreenshotSearchContextMenu();
  }
  async updateScreenshotSearchContextMenu() {
    if (await get('screenshotSearch')) {
      data.Image.screenshotSearchHandle = browser.contextMenus.create({
        "id": "screenshotSearch",
        "title": GL("screenshot_search"),
        "contexts": ["all"],
        "onclick": this.screenshotSearch
      });
    }else {
      if (data.Image.screenshotSearchHandle) {
        browser.contextMenus.remove(data.Image.screenshotSearchHandle);
        data.Image.screenshotSearchHandle = null;
      }
    }
  }
  async screenshotSearch(info, tab){
    browser.tabs.sendMessage(tab.id, 'loaded', (response) => {
      if (response == 'yes') {
        browser.tabs.captureVisibleTab(tab.windowId, (dataURL) => {
          browser.tabs.sendMessage(tab.id, {
            job: "screenshotSearch",
            data: dataURL
          });
        });
      } else {
        browser.tabs.captureVisibleTab(tab.windowId, (dataURL) => {
          browser.tabs.executeScript(tab.id, { file: 'thirdParty/jquery.min.js' }, () => {
            if (browser.runtime.lastError) {
              browser.notifications.create('screenshotFailed', {
                type: 'basic',
                iconUrl: '/images/icon_128.png',
                title: GL("ls_1"),
                message: GL("ls_2")
              }, voidFunc);
              return;
            }
            browser.tabs.executeScript(tab.id, { file: 'js/screenshotSearch.js' }, () => {
              browser.tabs.sendMessage(tab.id, {
                job: "screenshotSearch",
                data: dataURL
              });
            });
          });
        });
      }
    });
  }
  async updateImageSearchContextMenu() {
    if (await get('imageSearch')) {
      data.Image.imageSearchHandle = browser.contextMenus.create({
        "id": "imageSearch",
        "title": GL("search_this_image"),
        "contexts": ["image"],
        "onclick": this.imageSearch
      });
    }else {
      if (data.Image.imageSearchHandle) {
        browser.contextMenus.remove(data.Image.imageSearchHandle);
        data.Image.imageSearchHandle = null;
      }
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
  async updateExtractImageContextMenu() {
    if (await get('extractImages')) {
      data.Image.extractImageHandle = browser.contextMenus.create({
        "id": "extractImages",
        "title": GL("extract_images"),
        "contexts": ["all"],
        "onclick": this.extractImages
      });
    } else {
      if (data.Image.extractImageHandle) {
        browser.contextMenus.remove(data.Image.extractImageHandle);
        data.Image.extractImageHandle = null;
      }
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
