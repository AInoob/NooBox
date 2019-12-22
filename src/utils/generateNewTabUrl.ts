export const generateNewTabUrl = (path: string) => {
  return new Promise((resolve) => {
    const url = chrome.runtime.getURL(path);
    resolve(url);
  });
};
