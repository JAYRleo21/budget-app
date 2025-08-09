import { openDB } from 'idb';

const DB_NAME = 'BudgetAppDB';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore('incomes', { keyPath: 'id' });
    db.createObjectStore('accounts', { keyPath: 'id' });
    db.createObjectStore('expenses', { keyPath: 'id' });
    db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
  },
});

export const useIndexedDB = (storeName) => {
  const getAll = async () => {
    return (await dbPromise).getAll(storeName);
  };

  const add = async (item) => {
    return (await dbPromise).add(storeName, item);
  };

  const put = async (item) => {
    return (await dbPromise).put(storeName, item);
  };

  const remove = async (id) => {
    return (await dbPromise).delete(storeName, id);
  };

  return {
    getAll,
    add,
    put,
    remove,
  };
};
