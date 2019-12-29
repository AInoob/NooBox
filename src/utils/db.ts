import { IOptions } from '../background/options';
import { sendMessageToBackground } from './sendMessageToBackground';

type KeyType = keyof IOptions;

export const get = (key: KeyType, defaultValue?: any): Promise<any> => {
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

export const getDB = (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const indexedDB = window.indexedDB;
    const open = indexedDB.open('NooBox', 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      db.createObjectStore('Store', {
        keyPath: 'key'
      });
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('Store', 'readwrite');
      const store = tx.objectStore('Store');
      const action1 = store.get(key);
      action1.onsuccess = () => {
        if (action1.result) {
          resolve(action1.result.value);
        } else {
          resolve(null);
        }
      };
      action1.onerror = (e) => {
        console.log('getDB fail');
        reject(e);
      };
    };
  });
};

export const setDB = (key: string | number, value: any) => {
  return new Promise((resolve, reject) => {
    const indexedDB = window.indexedDB;
    const open = indexedDB.open('NooBox', 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      db.createObjectStore('Store', {
        keyPath: 'key'
      });
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('Store', 'readwrite');
      const store = tx.objectStore('Store');
      const action1 = store.put({
        key,
        value
      });
      action1.onsuccess = () => {
        resolve('set !');
      };
      action1.onerror = (e) => {
        console.log('setDB fail');
        reject(e);
      };
    };
  });
};

export const deleteDB = (key: string) => {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open('NooBox', 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      db.createObjectStore('Store', {
        keyPath: 'key'
      });
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('Store', 'readwrite');
      const store = tx.objectStore('Store');
      const action1 = store.delete(key);
      action1.onsuccess = () => {
        resolve();
      };
      action1.onerror = (e) => {
        console.log('deleteDB fail');
        reject(e);
      };
    };
  });
};
