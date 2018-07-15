const indexedDB = window.indexedDB;

export const get = key => {
  return new Promise(resolve => {
      browser.storage.sync.get(key, (result) => {
        resolve(result[key]);
      });
  });
};

export const set = (key, value) => {
  return new Promise(resolve => {
    // console.log(key,value);
    const temp = {};
    temp[key] = value;
    browser.storage.sync.set(temp, resolve);
  })
};

export const bgSet = (key, value) => {
  browser.runtime.sendMessage({ job: 'set', key, value });
}

export const isOptionOn = async key => {
  const value = await get(key);
  if (value == '1' || value == true) {
    return true;
  } else {
    return false
  }
};

export const getDB = key => {
  return new Promise((resolve, reject) => {
    const indexedDB = window.indexedDB;
    const open = indexedDB.open("NooBox", 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      const store = db.createObjectStore("Store", {
        keyPath: "key"
      });
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("Store", "readwrite");
      const store = tx.objectStore("Store");
      const action1 = store.get(key);
      action1.onsuccess = (e) => {
        if (e.target.result) {
          resolve(e.target.result.value);
        } else {
          resolve(null);
        }
      }
      action1.onerror = e => {
        console.log('getDB fail');
        reject(e);
      }
    }
  });
};

export const setDB = (key, value) => {
  return new Promise(((resolve, reject) => {
    const indexedDB = window.indexedDB;
    const open = indexedDB.open("NooBox", 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      const store = db.createObjectStore("Store", {
        keyPath: "key"
      });
    };
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("Store", "readwrite");
      const store = tx.objectStore("Store");
      const action1 = store.put({
        key,
        value
      });
      action1.onsuccess = () => {
        if (callback) {
          resolve();
        }
      }
      action1.onerror = (e) => {
        console.log('setDB fail');
        reject(e);
      }
    }
  }));
}

export const deleteDB = key => {
  return new Promise(((resolve, reject) => {
      const open = indexedDB.open("NooBox", 1);
      open.onupgradeneeded = () => {
        const db = open.result;
        const store = db.createObjectStore("Store", {
          keyPath: "key"
        });
      };
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction("Store", "readwrite");
        const store = tx.objectStore("Store");
        const action1 = store.delete(key);
        action1.onsuccess = () => {
          resolve();
        }
        action1.onerror = e => {
          console.log('deleteDB fail');
          reject(e);
        }
      }
  }));

};
