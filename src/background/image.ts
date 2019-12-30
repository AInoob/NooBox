import { ISearchResult } from '../searchResult/stores/searchResultStore';
import { ajax } from '../utils/ajax';
import { logEvent } from '../utils/bello';
import { checkUrlOrBase64 } from '../utils/checkImageType';
import { ENGINE_LIST, EngineType } from '../utils/constants';
import { convertDataUriToBinary } from '../utils/convertDataURIToBinary';
import { createNewTab } from '../utils/createNewTab';
import { get, getDB, setDB } from '../utils/db';
import { fetchImageBlob } from '../utils/fetchImageBlob';
import { generateNewTabUrl } from '../utils/generateNewTabUrl';
import { getI18nMessage } from '../utils/getI18nMessage';
import { ISendMessageToBackgroundRequest } from '../utils/sendMessageToBackground';
import { stringOrArrayBufferToString } from '../utils/stringOrArrayBufferToString';
import { voidFunc } from '../utils/voidFunc';
import { Ascii2dImageSearch } from './imageSearch/ascii2dImageSearch';
import { BaiduImageSearch } from './imageSearch/baiduImageSearch';
import { BaseImageSearch } from './imageSearch/baseImageSearch';
import { BingImageSearch } from './imageSearch/bingImageSearch';
import { GoogleImageSearch } from './imageSearch/googleImageSearch';
import { IqdbImageSearch } from './imageSearch/iqdbImageSearch';
import { SauceNaoImageSearch } from './imageSearch/saucenaoImageSearch';
import { TineyeImageSearch } from './imageSearch/tineyeImageSearch';
import { YandexImageSearch } from './imageSearch/yandexImageSearch';

export class Image {
  private imageUploadUrl: string = '';
  private imageDownloadUrl: string = '';
  private imageServerUrl = 'https://ainoob.com/api/get/imageServers/';
  private imageSearchHandle: any = null;
  private extractImageHandle: any = null;
  private screenshotSearchHandle: any = null;
  private IMAGE_SEARCH: string = 'beginImageSearch';
  private imageSearchMap: { [index in EngineType]: BaseImageSearch } = {
    ascii2d: new Ascii2dImageSearch('ascii2d'),
    baidu: new BaiduImageSearch('baidu'),
    bing: new BingImageSearch('bing'),
    iqdb: new IqdbImageSearch('iqdb'),
    saucenao: new SauceNaoImageSearch('saucenao'),
    tineye: new TineyeImageSearch('tineye'),
    google: new GoogleImageSearch('google'),
    yandex: new YandexImageSearch('yandex')
  };

  constructor() {
    this.updateImageUploadUrl('ainoob.com');
    this.updateImageDownloadUrl('ainoob.com');
  }

  public async init() {
    this.setUpListener();
    await this.updateImageSearchContextMenu();
    await this.updateExtractImageContextMenu();
    await this.updateScreenshotSearchContextMenu();
    await this.getImageServer();
  }

  public async updateImageSearchContextMenu() {
    if (await get('imageSearch')) {
      this.imageSearchHandle = chrome.contextMenus.create({
        contexts: ['image'],
        id: 'imageSearch',
        onclick: (image) => {
          this.beginImageSearch(image.srcUrl!).catch(console.error);
        },
        title: getI18nMessage('search_this_image')
      });
    } else {
      if (this.imageSearchHandle) {
        chrome.contextMenus.remove(this.imageSearchHandle);
        this.imageSearchHandle = null;
      }
    }
  }

  public async updateExtractImageContextMenu() {
    if (await get('extractImages')) {
      this.extractImageHandle = chrome.contextMenus.create({
        contexts: ['all'],
        id: 'extractImages',
        onclick: this.extractImages,
        title: getI18nMessage('extract_images')
      });
    } else {
      if (this.extractImageHandle) {
        chrome.contextMenus.remove(this.extractImageHandle);
        this.extractImageHandle = null;
      }
    }
  }

  public async updateScreenshotSearchContextMenu() {
    if (await get('screenshotSearch')) {
      this.screenshotSearchHandle = chrome.contextMenus.create({
        contexts: ['all'],
        id: 'screenshotSearch',
        onclick: this.screenshotSearch,
        title: getI18nMessage('screenshot_search')
      });
    } else {
      if (this.screenshotSearchHandle) {
        chrome.contextMenus.remove(this.screenshotSearchHandle);
        this.screenshotSearchHandle = null;
      }
    }
  }

  private setUpListener() {
    chrome.runtime.onMessage.addListener(
      (request: ISendMessageToBackgroundRequest, sender, sendResponse) => {
        switch (request.job) {
          case 'urlDownloadZip':
            const { files } = request.value;
            this.downloadExtractImages(sender, files);
            return sendResponse(null);
          case this.IMAGE_SEARCH:
            const { base64 } = request.value;
            this.beginImageSearch(base64).catch(console.error);
            return sendResponse(null);
        }
      }
    );
  }

  private updateImageUploadUrl(server: string) {
    this.imageUploadUrl = 'https://' + server + '/api/uploadImage/';
  }

  private updateImageDownloadUrl(server: string) {
    this.imageDownloadUrl = 'https://' + server + '/api/getImage/';
  }

  private async getImageServer() {
    const serverUrls = JSON.parse(
      (await ajax({ url: this.imageServerUrl })).body
    );
    let fastestServer: string | null = null;
    const pingPath = '/search';
    serverUrls.forEach(async (server: string) => {
      const startTime = new Date().getTime();
      await ajax({ url: 'https://' + server + pingPath });
      console.log(
        'fetched after ' + (new Date().getTime() - startTime) + 'ms: ' + server
      );
      if (!fastestServer) {
        fastestServer = server;
        this.updateImageUploadUrl(server);
        this.updateImageDownloadUrl(server);
      }
    });
  }

  private async screenshotSearch(
    _info: chrome.contextMenus.OnClickData,
    tab: chrome.tabs.Tab
  ) {
    chrome.tabs.sendMessage(tab.id!, 'loaded', (response) => {
      if (response === 'yes') {
        chrome.tabs.captureVisibleTab(tab.windowId, (dataURL) => {
          chrome.tabs.sendMessage(tab.id!, {
            data: dataURL,
            job: 'screenshotSearch'
          });
        });
      } else {
        chrome.tabs.captureVisibleTab(tab.windowId, (dataURL) => {
          chrome.tabs.executeScript(
            tab.id!,
            { file: 'thirdParty/jquery.min.js' },
            () => {
              if (chrome.runtime.lastError) {
                chrome.notifications.create(
                  'screenshotFailed',
                  {
                    iconUrl: '/images/icon_128.png',
                    message: getI18nMessage('ls_2'),
                    title: getI18nMessage('ls_1'),
                    type: 'basic'
                  },
                  (notificationId) => {
                    console.debug(notificationId);
                  }
                );
                return;
              }
              chrome.tabs.executeScript(
                tab.id!,
                { file: 'contentScript/screenshotSearch.js' },
                () => {
                  chrome.tabs.sendMessage(tab.id!, {
                    data: dataURL,
                    job: 'screenshotSearch'
                  });
                }
              );
            }
          );
        });
      }
    });
  }

  private extractImages(
    info: chrome.contextMenus.OnClickData,
    tab: chrome.tabs.Tab
  ) {
    logEvent({
      action: 'run',
      category: 'extractImages'
    });
    chrome.tabs.sendMessage(
      tab.id!,
      {
        job: 'extractImages'
      },
      {
        frameId: info.frameId
      },
      (response) => {
        if (!response) {
          chrome.notifications.create(
            'extractImages',
            {
              iconUrl: '/static/nooboxLogos/icon_128.png',
              message: getI18nMessage('ls_4'),
              title: getI18nMessage('extractImages'),
              type: 'basic'
            },
            (notificationId) => {
              console.debug(notificationId);
            }
          );
        }
        if (chrome.runtime.lastError) {
          console.error('Last error:', chrome.runtime.lastError);
        }
      }
    );
  }

  private downloadExtractImages(sender: any, files: any) {
    logEvent({
      action: 'run',
      category: 'downloadExtractImages'
    });
    const zip = new (window as any).JSZip();
    let remains = files.length;
    let total = files.length;
    let i = 0;
    let file = files[i];
    const reader = new window.FileReader();
    reader.onloadend = () => {
      addImage(reader.result);
    };
    function addImage(input?: string | ArrayBuffer | null) {
      if (input) {
        const dataUri: string = stringOrArrayBufferToString(input);
        const ext = (dataUri.slice(0, 20).match(/image\/(\w*)/) || ['', ''])[1];
        const binary = convertDataUriToBinary(dataUri);
        zip.file(file.name + '.' + ext, binary, {
          base64: false
        });
      } else {
        total--;
      }
      remains--;
      chrome.tabs.sendMessage(
        sender.tab.id,
        {
          job: 'downloadRemaining',
          remains,
          total
        },
        voidFunc
      );
      if (remains === 0) {
        zip
          .generateAsync({
            type: 'blob'
          })
          .then((content: any) => {
            (window as any).saveAs(content, 'NooBox.zip');
          });
      } else {
        file = files[++i];
        if (file.url.slice(0, 4) === 'data') {
          addImage(file.url);
        } else {
          fetchImageBlob(file.url, (blob: Blob) => {
            if (blob) {
              reader.readAsDataURL(blob);
            } else {
              addImage();
            }
          });
        }
      }
    }
    if (file.url.slice(0, 4) === 'data') {
      addImage(file.url);
    } else {
      fetchImageBlob(file.url, (blob: Blob) => {
        if (blob) {
          reader.readAsDataURL(blob);
        } else {
          addImage();
        }
      });
    }
  }

  private async beginImageSearch(base64orUrl: string) {
    console.log('begin to search');
    let cursor: number = (await getDB('imageCursor')) || 0;
    cursor++;
    await setDB('imageCursor', cursor);
    let imageLink: string;
    let url;
    // Check base64 or Url
    const imageType = checkUrlOrBase64(base64orUrl);

    const resultObj: ISearchResult = {
      base64: imageType === 'base64' ? base64orUrl : '',
      engineLink: {},
      engineStatus: {},
      searchImageInfo: [],
      searchResult: [],
      url: imageType === 'url' ? base64orUrl : ''
    };
    await setDB(cursor, resultObj);

    if (imageType === 'base64') {
      url = await generateNewTabUrl('searchResult.html');
      await createNewTab({
        active: await get('imageSearchNewTabFront'),
        url: url + '#/' + cursor
      });
      logEvent({
        action: 'dataURI',
        category: 'imageSearch'
      });
      const requestBody = {
        body: JSON.stringify({ data: base64orUrl }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        mode: 'cors'
      };
      try {
        imageLink =
          this.imageDownloadUrl +
          (
            await ajax({
              method: 'POST',
              body: JSON.stringify(requestBody),
              url: this.imageUploadUrl
            })
          ).body;
      } catch (e) {
        console.error(e);
        console.log('having error, switch to default server');
        this.updateImageUploadUrl('ainoob.com');
        this.updateImageDownloadUrl('ainoob.com');
        imageLink =
          this.imageDownloadUrl +
          (
            await ajax({
              method: 'POST',
              body: JSON.stringify(requestBody),
              url: this.imageUploadUrl
            })
          ).body;
      }
    } else if (imageType === 'url') {
      url = await generateNewTabUrl('searchResult.html');
      await createNewTab({
        active: await get('imageSearchNewTabFront'),
        url: url + '#/' + cursor
      });
      logEvent({
        action: 'url',
        category: 'imageSearch'
      });
      imageLink = base64orUrl;
    }

    // Get Opened Engine and send request
    ENGINE_LIST.forEach(async (engine) => {
      this.imageSearchMap[engine]
        .search(imageLink, cursor, resultObj)
        .catch(console.error);
    });
  }
}
