import userBrowser from '../utils/useBrowser';
import AutoRefresh from './AutoRefresh';
import Image from './Image';
import Options from './Options';
import { getDB } from '../utils/db';
userBrowser();

const autoRefresh = new AutoRefresh();
const image = new Image();
const options = new Options();

browser.tabs.onRemoved.addListener(tabId => {
  autoRefresh.delete(tabId);
});

browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (!request.job) {
    return;
  }
  const job = request.job;
  console.log(request);
  if (job === 'updateAutoRefresh') {
    const { tabId, interval, active, startAt } = request;
    const autoRefreshStatus = autoRefresh.update(tabId, active, interval, startAt, true);
    sendResponse(autoRefreshStatus);
  }
  else if (job === 'getCurrentTabAutoRefreshStatus') {
    const { tabId } = request;
    const autoRefreshStatus = autoRefresh.getStatus(tabId);
    sendResponse(autoRefreshStatus);
  } else if (job === "beginImageSearch") {
    const {base64} = request;
    image.beginImageSearch(base64);
    // browser.tabs.create({ url:"/searchResult.html" });
  } else if (request.job == 'urlDownloadZip') {
    image.downloadExtractImages(sender, request.files);
  } else if (request.job == 'getDB') {
    const value = getDB(request.key);
    browser.tabs.sendMessage(sender.tab.id, {
      job: 'returnDB',
      key: request.key,
      data: value
    });
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await options.init();
  await image.init();
});

