import data from './data';
import { logEvent } from '../utils/bello';
import {set} from "SRC/utils/db";

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
    setting.handler = null;
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
  getStatus(tabId) {
    const { interval, handler, lastIntervalAt } = this.getSetting(tabId);
    let active = false;
    let elapsedTime = 0;
    if (handler) {
      active = true;
      elapsedTime = new Date().getTime() - lastIntervalAt;
    }
    return {
      interval,
      active,
      elapsedTime,
    };
  }
  delete(tabId) {
    this.update(tabId, false);
    delete data.AutoRefresh.tabs[tabId];
  }
  update(tabId, active, interval, startAt, shouldLogEvent) {
    if (!tabId) {
      return;
    }
    this.clear(tabId);
    let action = 'stop';
    let setting = this.getSetting(tabId);
    let handler = setting.handler;
    let firstTimeInterval = interval;
    setting.interval = interval || setting.interval;
    if (active) {
      if (handler) {
        action = 'updateInterval';
      }
      else {
        action = 'start';
      }
      setting.lastIntervalAt = new Date().getTime();
      // when startAt exist and not 0
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
      logEvent({
        category: 'AutoRefresh',
        action
      });
    }
    return this.getStatus(tabId);
  }
}
