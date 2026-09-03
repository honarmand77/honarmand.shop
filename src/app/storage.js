// src/app/storage.js
// استوریج ساده برای redux-persist

const storage = {
  getItem: (key) => {
    try {
      const value = localStorage.getItem(key);
      return Promise.resolve(value);
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return Promise.resolve(null);
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
      return Promise.resolve();
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
      return Promise.resolve();
    }
  },
};

export default storage;