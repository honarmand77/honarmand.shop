// src/api/client.js
import axios from "axios";

// ============================================
// 🌐 تنظیمات API - پشتیبانی از Proxy
// ============================================

// در Production از مسیر نسبی (پروکسی) استفاده می‌کنیم
// در Development از آدرس مستقیم API
const API_URL = import.meta.env.PROD
  ? '' // در Production از پروکسی استفاده می‌شود (مسیر خالی)
  : (import.meta.env.VITE_API_URL || 'https://api.honarmand.shop/wp-json');

// آدرس تصاویر
const IMAGE_URL = import.meta.env.PROD
  ? '/wp-content/uploads'
  : 'https://api.honarmand.shop/wp-content/uploads';

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// ============================================
// 💾 مدیریت Token
// ============================================
export const tokenStorage = {
  set: (token, user) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user && typeof user === 'object') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error storing token:', error);
    }
  },
  getAccess: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      return token || null;
    } catch {
      return null;
    }
  },
  getUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ============================================
// 🔧 ایجاد Instance Axios
// ============================================
const createInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    // ✅ در Production از credentials استفاده نکنید (CORS)
    withCredentials: !import.meta.env.PROD,
  });

  // ============================================
  // 🔄 Interceptor برای Request
  // ============================================
  instance.interceptors.request.use(
    (config) => {
      // اضافه کردن Token
      const token = tokenStorage.getAccess();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // ✅ در Production از مسیرهای نسبی استفاده کن
      if (import.meta.env.PROD) {
        // اگر URL با https شروع می‌شود، آن را به مسیر نسبی تبدیل کن
        if (config.url && config.url.startsWith('https://api.honarmand.shop')) {
          config.url = config.url.replace('https://api.honarmand.shop/wp-json', '');
        }
      }

      // لاگ درخواست (فقط در Development)
      if (!import.meta.env.PROD) {
        console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // ============================================
  // 🔄 Interceptor برای Response
  // ============================================
  instance.interceptors.response.use(
    (response) => {
      // لاگ پاسخ (فقط در Development)
      if (!import.meta.env.PROD) {
        console.log('✅ API Response:', response.status, response.config.url);
      }
      return response;
    },
    async (error) => {
      // مدیریت خطای 401 (Unauthorized)
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;
        tokenStorage.clear();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // مدیریت خطای 503 (Service Unavailable)
      if (error.response?.status === 503) {
        console.error('❌ سرور در دسترس نیست (503)');
        // می‌توانید یک نوتیفیکیشن به کاربر نشان دهید
      }

      // مدیریت خطای 404 (Not Found)
      if (error.response?.status === 404) {
        console.error('❌ آدرس پیدا نشد (404):', error.config?.url);
      }

      // مدیریت خطای CORS
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        console.error('❌ خطای شبکه یا CORS:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// ============================================
// 🚀 ایجاد API Client
// ============================================
const api = createInstance(API_URL);

// ============================================
// 📦 API Client با متدهای کمکی
// ============================================
const client = {
  api,
  
  // متدهای اصلی
  get: (url, config = {}) => api.get(url, config).then(res => res.data),
  post: (url, data = {}, config = {}) => api.post(url, data, config).then(res => res.data),
  put: (url, data = {}, config = {}) => api.put(url, data, config).then(res => res.data),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config).then(res => res.data),
  delete: (url, config = {}) => api.delete(url, config).then(res => res.data),
  
  // مدیریت Token
  setToken: (token, user) => tokenStorage.set(token, user),
  clearToken: () => tokenStorage.clear(),
  isAuthenticated: () => !!tokenStorage.getAccess(),
  getUser: () => tokenStorage.getUser(),
  
  // ============================================
  // 🖼️ توابع کمکی برای تصاویر
  // ============================================
  getImageUrl: (path) => {
    if (!path) return '/images/default-collection.png';
    if (path.startsWith('http')) return path;
    // حذف پارامترهای اضافی
    const cleanPath = path.split('?')[0];
    return `${IMAGE_URL}${cleanPath}`;
  },
  
  // ============================================
  // 📊 توابع کمکی برای API
  // ============================================
  getEntries: (collectionId, params = {}) => {
    return client.get(`/hcms/v1/entries?collection_id=${collectionId}`, { params });
  },
  
  getProducts: (params = {}) => {
    return client.get('/wc/v3/products', { params });
  },
  
  getCategories: (params = {}) => {
    return client.get('/wc/store/products/categories', { params });
  },
  
  getBrands: (params = {}) => {
    return client.get('/wc/store/products/brands', { params });
  },
};

// ============================================
// 📝 لاگ در Console (فقط Development)
// ============================================
if (!import.meta.env.PROD) {
  console.log('🚀 API Client initialized:');
  console.log('   📡 Base URL:', API_URL || '(Proxy)');
  console.log('   🖼️ Image URL:', IMAGE_URL);
  console.log('   🔧 Mode:', import.meta.env.PROD ? 'Production' : 'Development');
}

export default client;