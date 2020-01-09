import { logEvent } from '../utils/bello';
import { getActiveTab } from '../utils/getActiveTab';
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

(window as any).options = options;

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
        return sendResponse(null);
      case 'getCurrentTabAutoRefreshStatus':
        const { tabId } = request.value;
        return sendResponse(autoRefresh.getSetting(tabId));
      case 'updateAutoRefresh':
        return sendResponse(autoRefresh.update(request.value));
      case 'urlDownloadZip':
        const { files } = request.value;
        image.downloadExtractImages(sender, files);
        return sendResponse(null);
      case 'beginImageSearch':
        const { base64OrUrl } = request.value;
        image.beginImageSearch(base64OrUrl).catch(console.error);
        return sendResponse(null);
      case 'videoControl':
        videoControl.notifyAllToPerformSelfCheck();
        return sendResponse(null);
      case 'set':
        const { key, value } = request.value;
        sendResponse({
          key,
          value
        });
        options.set(key, value).catch(console.error);
        break;
      case 'getOptions':
        return sendResponse(options.getOptions());
    }
  }
);

chrome.tabs.onRemoved.addListener((tabId) => {
  autoRefresh.delete(tabId);
});
