import { logEvent } from '../utils/bello';
import { clone } from '../utils/clone';

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

  public clear(tabId: number) {
    const setting = this.getSetting(tabId);
    if (setting.handler) {
      clearInterval(setting.handler);
    }
    setting.handler = null;
    this.tabs[tabId] = setting;
  }

  public delete(tabId: number) {
    this.update({ tabId, active: false });
    delete this.tabs[tabId];
  }

  public update(params: IUpdateAutoRefresh) {
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

  public getSetting(tabId: number) {
    return this.tabs[tabId] || clone(defaultTabStatus);
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
}
