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

if (typeof DEBUG_BUILD !== 'undefined' && DEBUG_BUILD) {
  import('../utils/debugCommandClient')
    .then(({ startDebugCommandPolling }) => startDebugCommandPolling())
    .catch((error) =>
      console.error('Failed to start debug command polling', error)
    );
}

chrome.commands.onCommand.addListener(async (command: string) => {
  switch (command) {
    case 'screenshotSearch':
      await image.screenshotSearch(null as any, (await getActiveTab())!);
      break;
    default:
      console.error('Unknown command: ' + command);
  }
});

chrome.runtime.onMessage.addListener(
  (request: ISendMessageToBackgroundRequest, sender, sendResponse) => {
    switch (request.job) {
      case 'analytics':
        logEvent(request.value);
        sendResponse(null);
        break;
      case 'getCurrentTabAutoRefreshStatus':
        sendResponse(autoRefresh.getSetting(request.value.tabId));
        break;
      case 'updateAutoRefresh':
        sendResponse(autoRefresh.update(request.value));
        break;
      case 'urlDownloadZip':
        image.downloadExtractImages(sender, request.value.files);
        sendResponse(null);
        break;
      case 'beginImageSearch':
        image.beginImageSearch(request.value.base64OrUrl).catch(console.error);
        sendResponse(null);
        break;
      case 'videoControl':
        videoControl.notifyAllToPerformSelfCheck();
        sendResponse(null);
        break;
      case 'set':
        sendResponse({
          key: request.value.key,
          value: request.value.value
        });
        options
          .set(request.value.key, request.value.value)
          .catch(console.error);
        break;
      case 'getOptions':
        sendResponse(options.getOptions());
        break;
      default:
        sendResponse(null);
    }
    return true;
  }
);

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
