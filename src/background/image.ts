import { imageSearchDao } from '../dao/imageSearchDao';
import {
  EngineStatusType,
  ISearchResult,
  ISingleSearchResultItem
} from '../searchResult/stores/searchResultStore';
import { ajax, IAjaxRequest } from '../utils/ajax';
import { logEvent } from '../utils/bello';
import { checkUrlOrBase64 } from '../utils/checkImageType';
import {
  ENGINE_DEFAULT_ENABLED,
  ENGINE_LIST,
  ENGINE_WEIGHTS,
  EngineType,
  getEngineOptionKey
} from '../utils/constants';
import { convertDataUriToBinary } from '../utils/convertDataURIToBinary';
import { get, getDB, setDB } from '../utils/db';
import { logDebug } from '../utils/debugReporter';
import { fetchImageBlob } from '../utils/fetchImageBlob';
import { getI18nMessage } from '../utils/getI18nMessage';
import { openSearchResultTab } from '../utils/openSearchResultTab';
import { getGlobalScope, isManifestV3 } from '../utils/runtime';
import { stringOrArrayBufferToString } from '../utils/stringOrArrayBufferToString';
import { voidFunc } from '../utils/voidFunc';
import { sendMessageToFrontend } from '../utils/sendMessageToFrontend';
import { EngineTabHooks, EngineTabManager } from './engineTabs';

interface IContentScriptResultItemPayload {
  title?: string;
  thumbUrl?: string;
  imageUrl?: string;
  sourceUrl?: string;
  description?: string;
  width?: number;
  height?: number;
  imageInfo?: {
    width?: number;
    height?: number;
  };
}

interface IEngineSectionError {
  section: string;
  message: string;
}

interface IEngineResultPayload {
  type?: 'engine:result';
  engine: EngineType;
  cursor?: number;
  keyword?: string;
  keywordLink?: string;
  results?: IContentScriptResultItemPayload[];
  docTitle?: string;
  url?: string;
  override?: boolean;
  aiOverview?: any;
  aboutImage?: any;
  errors?: IEngineSectionError[];
}

interface IEngineErrorPayload {
  type?: 'engine:error';
  engine: EngineType;
  cursor?: number;
  error?: string;
}

interface IEngineProgressPayload {
  type?: 'engine:progress';
  engine: EngineType;
  cursor?: number;
  stage?: string;
  message?: string;
}

export class Image {
  private imageUploadUrl: string = '';
  private imageDownloadUrl: string = '';
  private imageServerUrl = 'https://ainoob.com/api/get/imageServers/';
  private readonly engineTabs: EngineTabManager;

  constructor() {
    this.updateImageUploadUrl('ainoob.com');
    this.updateImageDownloadUrl('ainoob.com');
    this.migrateHistory().catch(console.error);
    this.engineTabs = new EngineTabManager({
      handleEngineLinkUpdate: this.handleEngineLinkUpdate,
      handleEngineError: this.handleEngineBootstrapError
    });
  }

  public async init() {
    await this.updateImageSearchContextMenu();
    await this.updateExtractImageContextMenu();
    await this.updateScreenshotSearchContextMenu();
    await this.getImageServer();
  }

  public async updateImageSearchContextMenu() {
    if (await get('imageSearch')) {
      await this.removeMenu('imageSearch');
      await this.createMenu('imageSearch', {
        contexts: ['image'],
        title: getI18nMessage('search_this_image')
      });
    } else {
      await this.removeMenu('imageSearch');
    }
  }

  public async updateExtractImageContextMenu() {
    if (await get('extractImages')) {
      await this.removeMenu('extractImages');
      await this.createMenu('extractImages', {
        contexts: ['all'],
        title: getI18nMessage('extract_images')
      });
    } else {
      await this.removeMenu('extractImages');
    }
  }

  public async updateScreenshotSearchContextMenu() {
    if (await get('screenshotSearch')) {
      await this.removeMenu('screenshotSearch');
      await this.createMenu('screenshotSearch', {
        contexts: ['all'],
        title: getI18nMessage('screenshot_search')
      });
    } else {
      await this.removeMenu('screenshotSearch');
    }
  }

  public downloadExtractImages(sender: any, files: any) {
    logEvent({
      action: 'run',
      category: 'downloadExtractImages'
    });

    if (isManifestV3()) {
      if (sender.tab?.id) {
        chrome.tabs.sendMessage(sender.tab.id, {
          job: 'downloadError',
          message:
            getI18nMessage('ls_3') ||
            'Please use the MV2 build to download ZIP files.'
        });
      }
      return;
    }

    const globalScope = getGlobalScope();
    const zip = new (globalScope as any).JSZip();
    let remains = files.length;
    let total = files.length;
    let i = 0;
    let file = files[i];
    const reader = new globalScope.FileReader();
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
            (globalScope as any).saveAs(content, 'NooBox.zip');
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

  public async beginImageSearch(base64orUrl: string) {
    let cursor: number = (await getDB('imageCursor')) || 0;
    cursor++;
    await setDB('imageCursor', cursor);
    let imageLink: string = '';
    // Check base64 or Url
    const imageType = checkUrlOrBase64(base64orUrl);

    const result: ISearchResult = {
      base64: imageType === 'base64' ? base64orUrl : '',
      engineLink: {},
      engineStatus: {},
      searchImageInfo: [],
      searchResult: [],
      url: imageType === 'url' ? base64orUrl : ''
    };
    const enabledEngines = await this.getEnabledEngines();
    ENGINE_LIST.forEach((engine) => {
      result.engineStatus![engine] = enabledEngines.includes(engine)
        ? 'loading'
        : 'disabled';
    });
    await imageSearchDao.add({
      id: cursor,
      createdAt: Date.now(),
      result
    });

    const searchTab = await openSearchResultTab(cursor);
    if (searchTab?.id != null) {
      this.engineTabs.registerSearchTab(cursor, searchTab.id);
    }
    logDebug({
      event: 'search:init',
      engine: 'all',
      tag: 'beginImageSearch',
      extra: {
        cursor,
        imageType
      }
    }).catch(() => undefined);
    if (imageType === 'base64') {
      logEvent({
        action: 'dataURI',
        category: 'imageSearch'
      });
      const request: IAjaxRequest = {
        method: 'POST',
        body: JSON.stringify({ data: base64orUrl }),
        headers: {
          'Content-Type': 'application/json'
        },
        url: this.imageUploadUrl
      };
      try {
        imageLink = this.imageDownloadUrl + (await ajax(request)).body;
      } catch (e) {
        console.error(e);
        console.log('having error, switch to default server');
        this.updateImageUploadUrl('ainoob.com');
        this.updateImageDownloadUrl('ainoob.com');
        imageLink = this.imageDownloadUrl + (await ajax(request)).body;
      }
    } else if (imageType === 'url') {
      logEvent({
        action: 'url',
        category: 'imageSearch'
      });
      imageLink = base64orUrl;
    }

    if (!imageLink) {
      imageLink = base64orUrl;
    }

    await this.engineTabs
      .openTabsForEngines(cursor, imageLink, enabledEngines)
      .catch((error) => {
        console.error('Failed to open engine tabs', error);
      });
  }

  public async handleEngineResultMessage(
    payload: IEngineResultPayload,
    sender: chrome.runtime.MessageSender
  ) {
    const context = this.engineTabs.resolveContextByTab(sender?.tab?.id);
    const engine = payload.engine || context?.engine;
    const cursor = payload.cursor ?? context?.cursor;
    if (!engine || cursor == null) {
      return;
    }
    const resolvedUrl =
      payload.url ||
      sender?.tab?.url ||
      this.engineTabs.getEngineUrl(cursor, engine);
    if (resolvedUrl) {
      await this.handleEngineLinkUpdate(cursor, engine, resolvedUrl);
      this.engineTabs.updateKnownUrl(cursor, engine, resolvedUrl);
    }
    const normalizedResults = this.normalizeResults(
      engine,
      payload.results || []
    );
    const isOverride = Boolean(payload.override);
    await this.mutateSearchResult(cursor, (result) => {
      result.engineStatus = result.engineStatus || {};
      result.engineStatus[engine] = 'loaded';
      if (isOverride && Array.isArray(result.searchResult)) {
        result.searchResult = result.searchResult.filter(
          (item) => item.searchEngine !== engine
        );
      }
      if (payload.keyword) {
        this.appendKeyword(result, {
          engine,
          keyword: payload.keyword,
          keywordLink: payload.keywordLink || resolvedUrl || ''
        });
      }
      if (normalizedResults.length) {
        this.appendResults(result, normalizedResults);
      }
    });
    await logDebug({
      event: 'engine:result',
      engine,
      url: resolvedUrl,
      extra: {
        cursor,
        keyword: payload.keyword,
        count: normalizedResults.length,
        override: isOverride,
        errors: payload.errors?.length || 0
      }
    }).catch(() => undefined);
  }

  public async handleEngineErrorMessage(
    payload: IEngineErrorPayload,
    sender: chrome.runtime.MessageSender
  ) {
    const context = this.engineTabs.resolveContextByTab(sender?.tab?.id);
    const engine = payload.engine || context?.engine;
    const cursor = payload.cursor ?? context?.cursor;
    if (!engine || cursor == null) {
      return;
    }
    await this.updateEngineStatus(cursor, engine, 'error');
    await logDebug({
      event: 'engine:error',
      engine,
      url: sender?.tab?.url,
      error: payload.error,
      extra: {
        cursor
      }
    }).catch(() => undefined);
  }

  public async handleEngineProgressMessage(
    payload: IEngineProgressPayload,
    sender: chrome.runtime.MessageSender
  ) {
    const context = this.engineTabs.resolveContextByTab(sender?.tab?.id);
    const engine = payload.engine || context?.engine;
    const cursor = payload.cursor ?? context?.cursor;
    if (!engine || cursor == null) {
      return;
    }
    await logDebug({
      event: 'engine:progress',
      engine,
      url: sender?.tab?.url,
      extra: {
        cursor,
        stage: payload.stage,
        message: payload.message
      }
    }).catch(() => undefined);
  }

  public async focusEngineTab(cursor: number, engine: EngineType) {
    await this.engineTabs.focusEngineTab(cursor, engine);
  }

  public async debugEngineEval(
    cursor: number,
    engine: EngineType,
    code: string
  ) {
    try {
      const result = await this.engineTabs.executeDebugScript(
        cursor,
        engine,
        code
      );
      await logDebug({
        event: 'engine:eval',
        engine,
        extra: {
          cursor,
          snippet: typeof result === 'string' ? result.slice(0, 120) : result,
          ts: Date.now()
        }
      }).catch(() => undefined);
      return result;
    } catch (error) {
      await logDebug({
        event: 'engine:eval:error',
        engine,
        error: error instanceof Error ? error.message : String(error),
        extra: {
          cursor,
          ts: Date.now()
        }
      }).catch(() => undefined);
      throw error;
    }
  }

  public async screenshotSearch(
    _info: chrome.contextMenus.OnClickData,
    tab: chrome.tabs.Tab
  ) {
    if (!tab.id) {
      return;
    }

    chrome.tabs.sendMessage(tab.id, 'loaded', (response) => {
      const capture = () => {
        chrome.tabs.captureVisibleTab(tab.windowId, (dataURL) => {
          chrome.tabs.sendMessage(tab.id!, {
            data: dataURL,
            job: 'screenshotSearch'
          });
        });
      };

      if (response === 'yes') {
        capture();
        return;
      }

      chrome.tabs.captureVisibleTab(tab.windowId, async (dataURL) => {
        try {
          await this.executeContentScript(tab.id!, 'thirdParty/jquery.min.js');
          await this.executeContentScript(
            tab.id!,
            'contentScript/screenshotSearch.js'
          );
          chrome.tabs.sendMessage(tab.id!, {
            data: dataURL,
            job: 'screenshotSearch'
          });
        } catch (error) {
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
          console.error('Failed to inject screenshot scripts', error);
        }
      });
    });
  }

  public extractImages(
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
              iconUrl: '/images/icon_128.png',
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

  private async getEnabledEngines(): Promise<EngineType[]> {
    const enabled: EngineType[] = [];
    for (const engine of ENGINE_LIST) {
      const key = getEngineOptionKey(engine) as any;
      const enabledSetting = await get(key, ENGINE_DEFAULT_ENABLED[engine]);
      if (enabledSetting) {
        enabled.push(engine);
      }
    }
    return enabled;
  }

  private async mutateSearchResult(
    cursor: number,
    mutator: (result: ISearchResult) => boolean | void,
    options: { notify?: boolean } = {}
  ): Promise<ISearchResult | null> {
    const record = await imageSearchDao.get(cursor);
    if (!record) {
      return null;
    }
    const shouldPersist = mutator(record.result);
    if (shouldPersist === false) {
      return record.result;
    }
    await imageSearchDao.add(record);
    if (options.notify !== false) {
      await sendMessageToFrontend({
        job: 'image_result_update',
        value: {
          cursor
        }
      }).catch(() => undefined);
    }
    return record.result;
  }

  private async updateEngineStatus(
    cursor: number,
    engine: EngineType,
    status: EngineStatusType
  ) {
    await this.mutateSearchResult(cursor, (result) => {
      result.engineStatus = result.engineStatus || {};
      result.engineStatus[engine] = status;
    });
  }

  private appendKeyword(
    result: ISearchResult,
    keyword: { engine: EngineType; keyword: string; keywordLink: string }
  ) {
    if (!keyword.keyword) {
      return;
    }
    const list = result.searchImageInfo || (result.searchImageInfo = []);
    const exists = list.some(
      (item) =>
        item.engine === keyword.engine && item.keyword === keyword.keyword
    );
    if (!exists) {
      list.push(keyword);
    }
  }

  private appendResults(
    result: ISearchResult,
    items: ISingleSearchResultItem[]
  ) {
    const list = result.searchResult || (result.searchResult = []);
    const seen = new Set(list.map((item) => this.getResultSignature(item)));
    items.forEach((item) => {
      const signature = this.getResultSignature(item);
      if (seen.has(signature)) {
        return;
      }
      seen.add(signature);
      list.push(item);
    });
  }

  private normalizeResults(
    engine: EngineType,
    rawItems: IContentScriptResultItemPayload[]
  ) {
    const baseWeight = ENGINE_WEIGHTS[engine] || 0;
    return rawItems.map((item, index) => {
      const width = item.imageInfo?.width ?? item.width ?? -1;
      const height = item.imageInfo?.height ?? item.height ?? -1;
      return {
        title: item.title || 'Possible Match',
        thumbUrl: item.thumbUrl || item.imageUrl || '',
        imageUrl: item.imageUrl || item.thumbUrl || '',
        sourceUrl: item.sourceUrl || '',
        imageInfo: {
          width,
          height
        },
        searchEngine: engine,
        description: item.description || '',
        weight: baseWeight - index + Math.random()
      } as ISingleSearchResultItem;
    });
  }

  private getResultSignature(item: ISingleSearchResultItem) {
    return `${item.sourceUrl || ''}|${item.imageUrl || ''}`;
  }

  private handleEngineLinkUpdate: EngineTabHooks['handleEngineLinkUpdate'] = async (
    cursor,
    engine,
    url
  ) => {
    if (!url) {
      return;
    }
    await this.mutateSearchResult(cursor, (result) => {
      result.engineLink = result.engineLink || {};
      if (result.engineLink[engine] === url) {
        return false;
      }
      result.engineLink[engine] = url;
      return true;
    });
  };

  private handleEngineBootstrapError: EngineTabHooks['handleEngineError'] = async (
    cursor,
    engine,
    error
  ) => {
    await this.updateEngineStatus(cursor, engine, 'error');
    await logDebug({
      event: 'engine:error',
      engine,
      error,
      extra: {
        cursor,
        phase: 'bootstrap'
      }
    }).catch(() => undefined);
  };

  private createMenu(
    id: string,
    props: chrome.contextMenus.CreateProperties
  ): Promise<void> {
    return new Promise((resolve) => {
      chrome.contextMenus.create(
        {
          ...props,
          id
        },
        () => {
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            console.debug('createMenu error:', lastError.message);
          }
          resolve();
        }
      );
    });
  }

  private removeMenu(id: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.contextMenus.remove(id, () => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          console.debug('removeMenu error:', lastError.message);
        }
        resolve();
      });
    });
  }

  private executeContentScript(tabId: number, file: string): Promise<void> {
    const scripting = (chrome as any).scripting;
    if (scripting && scripting.executeScript) {
      return scripting
        .executeScript({
          target: { tabId },
          files: [file]
        })
        .then(() => undefined);
    }

    return new Promise((resolve, reject) => {
      chrome.tabs.executeScript(tabId, { file }, () => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          reject(lastError);
        } else {
          resolve();
        }
      });
    });
  }

  private async migrateHistory() {
    const migrateV1 = await getDB('migratedV1');
    if (migrateV1) {
      console.log('skip migrating V1');
      return;
    }
    const cursor = await getDB('imageCursor');
    const now = Date.now();
    for (let i = 0; i <= cursor; i++) {
      const result = await getDB(i);
      if (result && (result.base64 || result.url)) {
        await imageSearchDao.add({
          id: i,
          createdAt: now + i,
          result
        });
      }
    }
    await setDB('migratedV1', true);
    console.log('migratedV1');
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
}
