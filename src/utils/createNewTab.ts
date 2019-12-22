export const createNewTab = (options: chrome.tabs.CreateProperties) => {
  return new Promise((resolve) => {
    chrome.tabs.create(options, async (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === 'complete' && tabId === tab.id) {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      });
    });
  });
};
