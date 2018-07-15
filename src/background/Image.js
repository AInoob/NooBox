import data from './data';
import { logEvent } from '../utils/bello';
import GL from '../utils/getLocale';
import { fetchBlob, convertDataURIToBinary } from '../utils';
import {reverseImageSearch} from 'SRC/js/reverseImageSearch.js';
import {engineMap} from 'SRC/constant/settingMap.js';
import {apiUrls} from 'SRC/constant/searchApiUrl.js';
import {get,set} from 'SRC/utils/db.js';
import ajax from 'SRC/utils/ajax.js';
export default class Image {
  constructor() {
    this.noobUploadUrl = "https://ainoob.com/api/uploadImage/";
    this.noobDownLoadUrl    = "https://ainoob.com/api/getImage/";
    this.fetchFunction ={
      googleLink: reverseImageSearch.fetchGoogleLink,
      baiduLink: reverseImageSearch.fetchBaiduLink,
      tinEyeLink: reverseImageSearch.fetchTineyeLink,
      bingLink: reverseImageSearch.fetchBingLink,
      yandexLink: reverseImageSearch.fetchYandexLink,
      saucenaoLink: reverseImageSearch.fetchSauceNaoLink,
      iqdbLink: reverseImageSearch.fetchIQDBLink,
      ascii2dLink: reverseImageSearch.fetchAscii2dLink,
    }
  }
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
    //Generate Image Link
    const requestBody   = {
      method: 'POST',  
      headers: {
        //'User-Agent': 'Mozilla/4.0 MDN Example',
        'Content-Type': 'application/json'
      },
      mode:"cors",
      body: JSON.stringify({data:base64}),
    }
    const imageLink       = this.noobDownLoadUrl + (await ajax(this.noobUploadUrl, requestBody)).data;
    browser.tabs.create({url: "/searchResult.html"});
    //
    reverseImageSearch.updateImage64({base64:base64});
    //Get Opened Engine
    for(let i = 0; i< engineMap.length; i++){
      let dbName = engineMap[i].dbName;
      let name   = engineMap[i].name;
      let check  = await get(dbName);
      if(check[dbName]){
         this.fetchFunction[name+"Link"](apiUrls[name] + imageLink);
      }
    }
    // const url = '/image.search.html?cursor=' + cursor + '&image=' + type;
    // const openTabFront = await promisedGet('imageSearchNewTabFront');
  }
}
