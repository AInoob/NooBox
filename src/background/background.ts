import { logEvent } from '../utils/bello';
import { ISendMessageToBackgroundRequest } from '../utils/sendMessageToBackground';
import { useChrome } from '../utils/useChrome';
import { AutoRefresh } from './autoRefresh';
import { Image } from './image';
import { Options } from './options';
import { VideoControl } from './videoControl';

useChrome();

const autoRefresh = new AutoRefresh();
(window as any).autoRefresh = autoRefresh;

const image = new Image();

const videoControl = new VideoControl();

const options = new Options(image, videoControl);

(window as any).options = options;

const ANALYTICS = 'analytics';
const IMAGE_SEARCH = 'beginImageSearch';
chrome.runtime.onMessage.addListener(
  (request: ISendMessageToBackgroundRequest, _sender, sendResponse) => {
    console.log(request);
    switch (request.job) {
      case ANALYTICS:
        logEvent(request.value);
        return sendResponse(null);
      case IMAGE_SEARCH:
        logEvent(request.value);
    }
  }
);
