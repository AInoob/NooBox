import { sendMessageToBackground } from './sendMessageToBackground';

type KeyType = 'followersCleanCount';

export const get = (key: KeyType, defaultValue?: any) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      if (result[key] == null && defaultValue != null) {
        resolve(defaultValue);
      }
      resolve(result[key]);
    });
  });
};

export const set = (key: KeyType, value: any) => {
  return new Promise((resolve) => {
    const temp: any = {};
    temp[key] = value;
    chrome.storage.sync.set(temp, resolve);
  });
};

export const bgSet = async (key: KeyType, value: any) => {
  await sendMessageToBackground({
    job: 'set',
    value: {
      key,
      value
    }
  });
};
