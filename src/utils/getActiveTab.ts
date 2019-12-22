import Tab = chrome.tabs.Tab;

export const getActiveTab = (): Promise<Tab | null> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (tabs[0]) {
        resolve(tabs[0]);
      } else {
        resolve(null);
      }
    });
  });
};
