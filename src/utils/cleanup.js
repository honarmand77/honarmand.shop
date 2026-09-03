// utils/cleanup.js
import { cache } from '../services/cacheManager';

export const cleanupCache = () => {
  // پاکسازی کش‌های منقضی شده
  cache.cleanExpired();
  
  // پاکسازی کش‌های موقت
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.startsWith('temp_') || key.startsWith('session_')) {
      cache.clear(key);
    }
  });
};

// اجرا در هنگام خروج از برنامه
window.addEventListener('beforeunload', cleanupCache);