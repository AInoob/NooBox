import { logEvent } from '../utils/bello';
import { getActiveTab } from '../utils/getActiveTab';
import { getGlobalScope, isManifestV3 } from '../utils/runtime';
import { ISendMessageToBackgroundRequest } from '../utils/sendMessageToBackground';
import { useChrome } from '../utils/useChrome';
import { AutoRefresh } from './autoRefresh';
import { Image } from './image';
import { Options } from './options';
import { VideoControl } from './videoControl';

useChrome();

const autoRefresh = new AutoRefresh();
const image = new Image();
const videoControl = new VideoControl();
const options = new Options(image, videoControl);

getGlobalScope().options = options;
getGlobalScope().nooboxImage = image;

chrome.commands.onCommand.addListener(async (command: string) => {
  switch (command) {
    case 'screenshotSearch':
      await image.screenshotSearch(null as any, (await getActiveTab())!);
      break;
    default:
      console.error('Unknown command: ' + command);
  }
});

chrome.runtime.onMessage.addListener((request: any, sender, sendResponse) => {
  const job = (request as ISendMessageToBackgroundRequest)?.job;
  if (job) {
    switch (job) {
      case 'analytics':
        logEvent(request.value);
        sendResponse(null);
        return true;
      case 'getCurrentTabAutoRefreshStatus':
        sendResponse(autoRefresh.getSetting(request.value.tabId));
        return true;
      case 'updateAutoRefresh':
        sendResponse(autoRefresh.update(request.value));
        return true;
      case 'urlDownloadZip':
        image.downloadExtractImages(sender, request.value.files);
        sendResponse(null);
        return true;
      case 'beginImageSearch':
        image.beginImageSearch(request.value.base64OrUrl).catch(console.error);
        sendResponse(null);
        return true;
      case 'videoControl':
        videoControl.notifyAllToPerformSelfCheck();
        sendResponse(null);
        return true;
      case 'set':
        sendResponse({
          key: request.value.key,
          value: request.value.value
        });
        options
          .set(request.value.key, request.value.value)
          .catch(console.error);
        return true;
      case 'getOptions':
        sendResponse(options.getOptions());
        return true;
      case 'focusEngineTab':
        image
          .focusEngineTab(request.value.cursor, request.value.engine)
          .catch(console.error);
        sendResponse(null);
        return true;
    }
  }

  switch (request?.type) {
    case 'engine:result':
      image.handleEngineResultMessage(request, sender).catch(console.error);
      console.log(request);
      sendResponse(null);
      return true;
    case 'engine:error':
      image.handleEngineErrorMessage(request, sender).catch(console.error);
      sendResponse(null);
      return true;
    case 'engine:progress':
      image.handleEngineProgressMessage(request, sender).catch(console.error);
      sendResponse(null);
      return true;
    case 'debugEngineEval':
      image
        .debugEngineEval(
          request.value.cursor,
          request.value.engine,
          request.value.code
        )
        .then((result) => sendResponse({ ok: true, result }))
        .catch((error: Error) => {
          sendResponse({ ok: false, error: error?.message || String(error) });
        });
      return true;
  }

  sendResponse(null);
  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  image.init().catch(console.error);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'imageSearch':
      if (info.srcUrl) {
        image.beginImageSearch(info.srcUrl).catch(console.error);
      }
      break;
    case 'extractImages':
      if (tab) {
        image.extractImages(info, tab);
      }
      break;
    case 'screenshotSearch':
      if (tab) {
        image.screenshotSearch(info, tab).catch(console.error);
      }
      break;
  }
});

if (isManifestV3()) {
  chrome.runtime.onStartup?.addListener(() => {
    image.init().catch(console.error);
  });
}

chrome.tabs.onRemoved.addListener((tabId) => {
  autoRefresh.delete(tabId);
});
