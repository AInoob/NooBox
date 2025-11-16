export const createNewTab = (options: chrome.tabs.CreateProperties) => {
  return new Promise<chrome.tabs.Tab>((resolve) => {
    chrome.tabs.create(options, (tab) => {
      const initialTab = tab;
      const listener = (
        tabId: number,
        info: chrome.tabs.TabChangeInfo,
        updatedTab: chrome.tabs.Tab
      ) => {
        if (info.status === 'complete' && tabId === initialTab.id) {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(updatedTab || initialTab);
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
      if (initialTab.id == null) {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve(initialTab);
        return;
      }
      if (initialTab.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve(initialTab);
      }
    });
  });
};
