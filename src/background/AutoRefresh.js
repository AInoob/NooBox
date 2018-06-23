import data from './data';
import { logEvent } from '../utils/bello';

export default AutoRefresh = {
  update: async (tabId, interval, start, userAction) => {
    if (!tabId) {
      return;
    }
    let action = 'stop';
    let setting = data.AutoRefresh.tabs[tabId] || { };
    if (interval) {
      setting.interval = interval;
    }
    let { handler } = setting;
    setting.handler = null;
    if (handler) {
      clearInterval(handler);
    }
    if (start) {
      if (handler) {
        action = 'updateInterval';
      }
      else {
        action = 'start';
      }
      handler = setInterval(() => {
        browser.tabs.reload(tabId, {}, () => {
          console.log('refresh');
        });
      }, interval);
      setting.handler = handler;
    }
    data.AutoRefresh.tabs[tabId] = setting;
    if (userAction) {
      await logEvent({
        category: 'AutoRefresh',
        action
      });
    }
  },
};
