import { getHostnameFromUrl } from '../utils/getHostnameFromUrl';
import { voidFunc } from '../utils/voidFunc';

export class VideoControl {
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
}
