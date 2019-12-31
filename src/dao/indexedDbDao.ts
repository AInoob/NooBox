type BasicFieldType = 'id' | 'createdAt';

export type IDirection = 'forward' | 'backward';

export class IndexedDbDao<IRecord, IndexedFieldType extends BasicFieldType> {
  private readonly dbName: string = '';
  constructor(dbName: string) {
    this.dbName = dbName;
  }

  public count() {
    return new Promise<number>((resolve, reject) => {
      const open = this.getDBRequest();
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction(this.dbName, 'readonly');
        const store = tx.objectStore(this.dbName);
        const action = store.count();
        action.onsuccess = (e: any) => {
          if (e.target.result) {
            resolve(e.target.result);
            db.close();
          } else {
            resolve(0);
            db.close();
          }
        };
        action.onerror = (e: any) => {
          console.error('countDB fail');
          reject(e);
        };
      };
    });
  }
  public get(key: string | number, type?: IndexedFieldType) {
    return new Promise<IRecord | null>((resolve, reject) => {
      const open = this.getDBRequest();
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction(this.dbName, 'readonly');
        const store = tx.objectStore(this.dbName);
        const action =
          type === undefined || type === 'id'
            ? store.get(key)
            : store.index(type).get(key);
        action.onsuccess = (e: any) => {
          if (e.target.result) {
            resolve(e.target.result);
            db.close();
          } else {
            resolve(null);
            db.close();
          }
        };
        action.onerror = (e: any) => {
          console.error('getDB fail');
          reject(e);
        };
      };
    });
  }
  public add(history: IRecord) {
    return new Promise((resolve, reject) => {
      const open = this.getDBRequest();
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction(this.dbName, 'readwrite');
        const store = tx.objectStore(this.dbName);
        const action = store.put(history);
        action.onsuccess = () => {
          resolve('set !');
          db.close();
        };
        action.onerror = (e: any) => {
          console.error('setDB fail');
          reject(e);
          db.close();
        };
      };
    });
  }
  public getDBRequest = () => {
    const open = indexedDB.open(this.dbName, 1);
    open.onerror = (e: any) => {
      throw e;
    };
    open.onupgradeneeded = () => {
      const db = open.result;
      const store = db.createObjectStore(this.dbName, {
        keyPath: 'id'
      });
      store.createIndex('createdAt', 'createdAt', { unique: false });
    };
    return open;
  };
  public remove(id: string | number) {
    return new Promise((resolve, reject) => {
      const open = this.getDBRequest();
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction(this.dbName, 'readwrite');
        const store = tx.objectStore(this.dbName);
        const action = store.delete(id);
        action.onsuccess = () => {
          resolve();
          db.close();
        };
        action.onerror = (e: any) => {
          console.error('deleteDB fail');
          reject(e);
          db.close();
        };
      };
    });
  }
  public clear() {
    return new Promise((resolve, reject) => {
      const open = this.getDBRequest();
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction(this.dbName, 'readwrite');
        const store = tx.objectStore(this.dbName);
        const action = store.clear();
        action.onsuccess = () => {
          resolve();
          db.close();
        };
        action.onerror = (e: any) => {
          console.error('deleteDB fail');
          reject(e);
          db.close();
        };
      };
    });
  }
  public async iterate({
    type,
    direction,
    size,
    key
  }: {
    key?: any;
    size: number;
    type?: IndexedFieldType;
    direction: IDirection;
  }) {
    return new Promise<{ hasNext: boolean; recordList: IRecord[] }>(
      async (resolve, reject) => {
        const open = this.getDBRequest();
        open.onsuccess = () => {
          const db = open.result;
          const tx = db.transaction(this.dbName, 'readonly');
          const store = tx.objectStore(this.dbName);
          let query: IDBKeyRange | null = null;
          if (key) {
            query =
              direction === 'backward'
                ? IDBKeyRange.upperBound(key, true)
                : IDBKeyRange.lowerBound(key, true);
          }

          const indexDBDirection = direction === 'backward' ? 'prev' : 'next';
          const action: IDBRequest =
            type === undefined || type === 'id'
              ? store.openCursor(query, indexDBDirection)
              : store.index(type).openCursor(query, indexDBDirection);

          const recordList: IRecord[] = [];
          action.onsuccess = (e: any) => {
            const cursor = e.target.result;
            if (recordList.length < size && cursor) {
              recordList.push(cursor.value);
            }
            if (recordList.length < size && cursor) {
              cursor.continue();
            } else {
              resolve({
                hasNext: !!cursor,
                recordList
              });
            }
          };
          action.onerror = (e: any) => {
            console.error('failed');
            reject(e);
          };
        };
      }
    );
  }
}
