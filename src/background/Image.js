import data from './data';
import { logEvent } from '../utils/bello';
import GL from '../utils/getLocale';
import { fetchBlob, convertDataURIToBinary } from '../utils';
import {reverseImageSearch} from 'SRC/js/reverseImageSearch.js';
import {engineMap} from 'SRC/constant/settingMap.js';
import {apiUrls} from 'SRC/constant/searchApiUrl.js';
import {get,set,getDB,setDB} from 'SRC/utils/db.js';
import ajax from 'SRC/utils/ajax.js';
import {checkUrlOrBase64} from "SRC/utils/imageUtils";
import {createNewTab,sendMessage,generateNewTabUrl,createSandbox} from 'SRC/utils/browserUtils'
export default class Image {
  constructor() {
    this.noobUploadUrl;
    this.noobDownLoadUrl;
    this.updateImageUploadUrl('ainoob.com');
    this.updateImageDownloadUrl('ainoob.com');
    this.noobFetchImageServerUrls    = "https://ainoob.com/api/get/imageServers/";
    this.fetchFunction = {
      googleLink: reverseImageSearch.fetchGoogleLink,
      baiduLink: reverseImageSearch.fetchBaiduLink,
      tineyeLink: reverseImageSearch.fetchTineyeLink,
      bingLink: reverseImageSearch.fetchBingLink,
      yandexLink: reverseImageSearch.fetchYandexLink,
      saucenaoLink: reverseImageSearch.fetchSauceNaoLink,
      iqdbLink: reverseImageSearch.fetchIQDBLink,
      ascii2dLink: reverseImageSearch.fetchAscii2dLink,
    }
  }

  updateImageUploadUrl(server) {
    this.noobUploadUrl = 'https://' + server + '/api/uploadImage/';
  }

  updateImageDownloadUrl(server) {
    this.noobDownLoadUrl = 'https://' + server + '/api/getImage/';
  }

  async init() {
    await this.updateExtractImageContextMenu();
    await this.updateImageSearchContextMenu();
    await this.updateScreenshotSearchContextMenu();
    await this.getUploadServer();
  }

  async getUploadServer() {
    const serverUrls = (await ajax(this.noobFetchImageServerUrls, {})).data;
    let fastestServer = null;
    const pingPath = '/search';
    serverUrls.forEach(async server => {
      let startTime = new Date().getTime();
      await ajax('https://' + server + pingPath);
      // console.log('fetched after ' + (new Date().getTime() - startTime) + 'ms: ' + server);
      if (!fastestServer) {
        fastestServer = server;
        this.updateImageUploadUrl(server);
        this.updateImageDownloadUrl(server);
      }
    });
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
        "onclick": (image)=>{
          this.beginImageSearch(image.srcUrl);
        }
      });
    }else{
      if (data.Image.imageSearchHandle) {
        browser.contextMenus.remove(data.Image.imageSearchHandle);
        data.Image.imageSearchHandle = null;
      }
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
    logEvent({
      category: 'extractImages',
      action: 'run'
    });
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
      console.log("Last error:", browser.runtime.lastError);
    });
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
    // console.log(file);
    const reader = new window.FileReader();
    reader.onloadend = () => {
      // console.log(remains);
      addImage(reader.result);
    }
    function addImage(dataURI) {
      if (dataURI) {
        const ext = (dataURI.slice(0, 20).match(/image\/(\w*)/) || ['', ''])[1];
        const binary = convertDataURIToBinary(dataURI);
        // console.log(binary);
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
  async loadImageHistory(cursor){
    let url = await generateNewTabUrl("searchResult.html");
    await createNewTab({
      url: url+"#/"+cursor,
      active: await get('imageSearchNewTabFront')
    });
  }
  async beginImageSearch(base64orUrl){
    let cursor = await getDB('imageCursor');
    // console.log(cursor);
    if (typeof (cursor) === 'number') {
        cursor++;
    }else{
        cursor = 0;
    }

    let imageLink;
    let url;
    //Check base64 or Url
    switch (checkUrlOrBase64(base64orUrl)) {
      case "base64":
      // console.log("here");
      await setDB(cursor,{base64:base64orUrl});
      url = await generateNewTabUrl("searchResult.html");
      await createNewTab({
        url: url+"#/" + cursor,
        active: await get('imageSearchNewTabFront')
      });
        logEvent({
          category: 'imageSearch',
          action: 'dataURI'
        });
        const requestBody = {
          method: 'POST',
          headers: {
            //'User-Agent': 'Mozilla/4.0 MDN Example',
            'Content-Type': 'application/json'
          },
          mode: "cors",
          body: JSON.stringify({ data: base64orUrl }),
        }
        imageLink = this.noobDownLoadUrl + (await ajax(this.noobUploadUrl, requestBody)).data;
        break;
      case "url":
      await setDB(cursor,{url:base64orUrl});

      url = await generateNewTabUrl("searchResult.html");
      await createNewTab({
        url: url+"#/" + cursor,
        active: await get('imageSearchNewTabFront')
      });
        logEvent({
          category: 'imageSearch',
          action: 'url'
        });
        imageLink = base64orUrl;
        base64Flag = false;
        break;
      default:
        break;
    }
    //Generate Image Link
    //console.log(imageLink);
    if(imageLink) {
      let engineLink={};
      //Get Opened Engine and send request
      for(let i = 0; i< engineMap.length; i++){
        let dbName = engineMap[i].dbName;
        let name   = engineMap[i].name;
        let check  = await get(dbName);
        if(check && this.fetchFunction[name+"Link"]){ 
          engineLink[name] = apiUrls[name] + imageLink;
          if(name === "baidu"){
            await createSandbox();
          }
          if(name === "bing"){
            this.fetchFunction[name+"Link"](apiUrls[name] + imageLink,imageLink,cursor);
          }else if(name == "ascii2d"){
            this.fetchFunction[name+"Link"](apiUrls[name],imageLink,cursor)
          }else{
            this.fetchFunction[name+"Link"](apiUrls[name] + imageLink,cursor);
          }
        }
      }
      reverseImageSearch.updateEngineLink(engineLink,cursor)
    }
    
  }

}
