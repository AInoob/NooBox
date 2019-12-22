import { getHostnameFromUrl } from '../utils/getHostnameFromUrl';
import { ISendMessageToBackgroundRequest } from '../utils/sendMessageToBackground';
import { voidFunc } from '../utils/voidFunc';

export class VideoControl {
  constructor() {
    this.setUpListener();
  }

  public notifyAllToPerformSelfCheck() {
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(
          tab.id!,
          {
            job: 'videoControlContentScriptSelfCheck'
          },
          voidFunc
        );
      }
    });
  }

  public notifyVideoControlSwitch(hostname: string, enabled: boolean) {
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (tab.url && getHostnameFromUrl(tab.url) === hostname) {
          chrome.tabs.sendMessage(
            tab.id!,
            {
              job: 'videoControlContentScriptSwitch',
              value: {
                enabled
              }
            },
            voidFunc
          );
        }
      }
    });
  }

  private setUpListener() {
    chrome.runtime.onMessage.addListener(
      (request: ISendMessageToBackgroundRequest, _sender, sendResponse) => {
        switch (request.job) {
          case 'videoControl':
            this.notifyAllToPerformSelfCheck();
            return sendResponse(null);
        }
      }
    );
  }
}
