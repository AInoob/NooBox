import userBrowser from '../utils/useBrowser';
import AutoRefresh from './AutoRefresh';

userBrowser();

const autoRefresh = new AutoRefresh();
window.x = autoRefresh;

browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (!request.job) {
    return;
  }
  const job = request.job;
  if (job === 'updateAutoRefresh') {
    const { tabId, interval, active, startAt } = request;
    const autoRefreshStatus = await autoRefresh.update(tabId, active, interval, startAt, true);
    sendResponse(autoRefreshStatus);
  }
  else if (job === 'getCurrentTabAutoRefreshStatus') {
    const { tabId } = request;
    const autoRefreshStatus = autoRefresh.getStatus(tabId);
    console.log(autoRefreshStatus);
    sendResponse(autoRefreshStatus);
  }
});
