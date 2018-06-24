import data from './data';
import { logEvent } from '../utils/bello';

const defaultSetting = {
  handler: null,
  interval: 3000,
  lastIntervalAt: null,
  isFirstTimeInterval: false,
  firstTimeInterval: 0,
};

export default class AutoRefresh {
  constructor() {}
  clear(tabId) {
    const setting = this.getSetting(tabId);
    if (setting.handler) {
      clearInterval(setting.handler);
    }
  }
  performAutoRefresh(tabId) {
    browser.tabs.reload(tabId, {}, () => {
      console.log('refresh');
    });
    const setting = this.getSetting(tabId);
    setting.lastIntervalAt = new Date().getTime();
    if (setting.isFirstTimeInterval) {
      this.clear(tabId);
      setting.isFirstTimeInterval = false;
      setting.handler = setInterval(() => {
        this.performAutoRefresh(tabId);
      }, setting.interval);
    }
    data.AutoRefresh.tabs[tabId] = setting;
  }
  getSetting(tabId) {
    const setting = data.AutoRefresh.tabs[tabId] || defaultSetting;
    return setting;
  }
  async update(tabId, interval, enable, startAt, shouldLogEvent) {
    if (!tabId) {
      return;
    }
    this.clear(tabId);
    let action = 'stop';
    let setting = this.getSetting(tabId);
    let handler = setting.handler;
    let firstTimeInterval = interval;
    setting.interval = interval || setting.interval;
    if (enable) {
      if (handler) {
        action = 'updateInterval';
      }
      else {
        action = 'start';
      }
      setting.lastIntervalAt = new Date().getTime();
      if (startAt) {
        firstTimeInterval = (interval - startAt) % interval;
        setting.isFirstTimeInterval = true;
        setting.firstTimeInterval = firstTimeInterval;
      }
      handler = setInterval(() => {
        this.performAutoRefresh(tabId);
      }, firstTimeInterval);
      setting.handler = handler;
    }
    data.AutoRefresh.tabs[tabId] = setting;
    if (shouldLogEvent) {
      await logEvent({
        category: 'AutoRefresh',
        action
      });
    }
  }
}
