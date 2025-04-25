const CONFIG = require('../config');

class Database {
  constructor() {
    this._dbName = CONFIG.DATABASE_NAME;
    this._dbVersion = CONFIG.DATABASE_VERSION;
    this._objectStoreName = CONFIG.OBJECT_STORE_NAME;
    this._db = null;
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this._dbName, this._dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this._objectStoreName)) {
          db.createObjectStore(this._objectStoreName, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this._db = event.target.result;
        resolve(this._db);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async getAllData() {
    if (!this._db) await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(this._objectStoreName, 'readonly');
      const store = transaction.objectStore(this._objectStoreName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async getData(id) {
    if (!this._db) await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(this._objectStoreName, 'readonly');
      const store = transaction.objectStore(this._objectStoreName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async putData(data) {
    if (!this._db) await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(this._objectStoreName, 'readwrite');
      const store = transaction.objectStore(this._objectStoreName);
      const request = store.put(data);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async deleteData(id) {
    if (!this._db) await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(this._objectStoreName, 'readwrite');
      const store = transaction.objectStore(this._objectStoreName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async clearAllData() {
    if (!this._db) await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(this._objectStoreName, 'readwrite');
      const store = transaction.objectStore(this._objectStoreName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
}

const database = new Database();
export default database;