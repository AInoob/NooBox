import { logEvent } from '../utils/bello';
import { clone } from '../utils/clone';
import { ISendMessageToBackgroundRequest } from '../utils/sendMessageToBackground';

export interface ITabStatus {
  handler?: any;
  interval: number;
  lastRefreshedAt: null | number;
  isFirstTimeInterval: boolean;
  firstTimeInterval: number;
}

export const defaultTabStatus: ITabStatus = {
  firstTimeInterval: 0,
  handler: null,
  interval: 6000,
  isFirstTimeInterval: false,
  lastRefreshedAt: null
};

export interface IUpdateAutoRefresh {
  tabId: number;
  active: boolean;
  interval?: number;
  startAt?: number;
  shouldLogEvent?: boolean;
}

export class AutoRefresh {
  private tabs: { [index: number]: ITabStatus } = {};

  constructor() {
    this.setUpListener();
  }

  private setUpListener() {
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.delete(tabId);
    });
    chrome.runtime.onMessage.addListener(
      (request: ISendMessageToBackgroundRequest, _sender, sendResponse) => {
        switch (request.job) {
          case 'getCurrentTabAutoRefreshStatus':
            const { tabId } = request.value;
            return sendResponse(this.getSetting(tabId));
          case 'updateAutoRefresh':
            return sendResponse(this.update(request.value));
        }
      }
    );
  }

  private clear(tabId: number) {
    const setting = this.getSetting(tabId);
    if (setting.handler) {
      clearInterval(setting.handler);
    }
    setting.handler = null;
    this.tabs[tabId] = setting;
  }

  private performAutoRefresh(tabId: number) {
    chrome.tabs.reload(tabId, {}, () => {
      console.log('refresh');
    });
    const setting = this.getSetting(tabId);
    setting.lastRefreshedAt = new Date().getTime();
    if (setting.isFirstTimeInterval) {
      this.clear(tabId);
      setting.isFirstTimeInterval = false;
      setting.handler = setInterval(() => {
        this.performAutoRefresh(tabId);
      }, setting.interval);
    }
    this.tabs[tabId] = setting;
  }

  private delete(tabId: number) {
    this.update({ tabId, active: false });
    delete this.tabs[tabId];
  }

  private update(params: IUpdateAutoRefresh) {
    const { tabId, active, startAt, shouldLogEvent } = params;
    let { interval } = params;
    if (!tabId) {
      return;
    }
    this.clear(tabId);
    let action = 'stop';
    const setting = this.getSetting(tabId);
    let handler = setting.handler;
    setting.interval = interval || setting.interval;
    interval = setting.interval;
    let firstTimeInterval = interval;
    if (active) {
      action = handler ? 'updateInterval' : 'start';
      setting.lastRefreshedAt = new Date().getTime();
      // when startAt exist and not 0
      if (startAt) {
        firstTimeInterval = (interval - startAt) % interval;
        setting.isFirstTimeInterval = true;
        setting.firstTimeInterval = firstTimeInterval;
        setting.lastRefreshedAt = setting.lastRefreshedAt - startAt;
      }
      handler = setInterval(() => {
        this.performAutoRefresh(tabId);
      }, firstTimeInterval);
      setting.handler = handler;
    }
    this.tabs[tabId] = setting;
    if (shouldLogEvent) {
      logEvent({
        action,
        category: 'Options'
      });
    }
    return this.getSetting(tabId);
  }

  private getSetting(tabId: number) {
    return this.tabs[tabId] || clone(defaultTabStatus);
  }
}
