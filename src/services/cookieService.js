import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// تنظیمات کوکی
const COOKIE_OPTIONS = {
  expires: 7, // 7 روز
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  path: '/',
};

export const cookieService = {
  // ذخیره توکن
  setTokens: (accessToken, refreshToken) => {
    if (accessToken) {
      Cookies.set(TOKEN_KEY, accessToken, COOKIE_OPTIONS);
    }
    if (refreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, refreshToken, COOKIE_OPTIONS);
    }
  },

  // دریافت توکن
  getAccessToken: () => {
    return Cookies.get(TOKEN_KEY) || null;
  },

  getRefreshToken: () => {
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  },

  // حذف توکن‌ها (خروج)
  removeTokens: () => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
    Cookies.remove(USER_KEY, { path: '/' });
  },

  // ذخیره اطلاعات کاربر
  setUser: (userData) => {
    if (userData) {
      Cookies.set(USER_KEY, JSON.stringify(userData), COOKIE_OPTIONS);
    }
  },

  getUser: () => {
    const userData = Cookies.get(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // بررسی وجود توکن
  isAuthenticated: () => {
    return !!Cookies.get(TOKEN_KEY);
  },
};