// require("babel-core/register");
import 'babel-polyfill';

import userBrowser from '../utils/useBrowser';
import AutoRefresh from './AutoRefresh';

const autoRefresh = new AutoRefresh();
window.x = autoRefresh;

browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (!request.job) {
    return;
  }
  const job = request.job;
  if (job == 'updateAutoRefresh') {
    const { tabId, interval, handler } = request;
    autoRefresh.update(tabId, interval, handler, true);
  }
  else if (job == 'currentTabAutoRefreshState') {
    const { tabId } = request;
    const autoRefreshSetting = autoRefresh.getSetting()
    sendResponse(autoRefreshSetting);
  }
});
