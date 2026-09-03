// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from './storage';

// ============================================
// IMPORTS اصلی (همیشه لود می‌شوند)
// ============================================
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import uiReducer from '../features/ui/uiSlice';

import { authAPI } from '../features/auth/authAPI';
import { cartAPI } from '../features/cart/cartAPI';

// ============================================
// IMPORTS ثانویه (با Lazy Loading)
// ============================================
import { productsAPI } from '../features/products/productsAPI';
import { categoriesAPI } from '../features/categories/categoriesAPI';
import { brandsAPI } from '../features/brands/brandsAPI';
import { bannersAPI } from '../features/banners/bannersAPI';
import { pagesAPI } from '../features/pages/pagesAPI';

import productsReducer from '../features/products/productsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import brandsReducer from '../features/brands/brandsSlice';
import bannersReducer from '../features/banners/bannersSlice';
import pagesReducer from '../features/pages/pagesSlice';

// ============================================
// کانفیگ persist
// ============================================
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'],
  timeout: 1000,
  throttle: 1000,
  serialize: true,
};

// ============================================
// ALL REDUCERS (همه در اینجا تعریف می‌شوند)
// ============================================
const allReducers = {
  auth: authReducer,
  cart: cartReducer,
  ui: uiReducer,
  products: productsReducer,
  categories: categoriesReducer,
  brands: brandsReducer,
  banners: bannersReducer,
  pages: pagesReducer,
  [authAPI.reducerPath]: authAPI.reducer,
  [cartAPI.reducerPath]: cartAPI.reducer,
  [productsAPI.reducerPath]: productsAPI.reducer,
  [categoriesAPI.reducerPath]: categoriesAPI.reducer,
  [brandsAPI.reducerPath]: brandsAPI.reducer,
  [bannersAPI.reducerPath]: bannersAPI.reducer,
  [pagesAPI.reducerPath]: pagesAPI.reducer,
};

// ============================================
// RootReducer
// ============================================
const rootReducer = combineReducers(allReducers);

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ============================================
// ALL MIDDLEWARES (همه در اینجا تعریف می‌شوند)
// ============================================
const allMiddlewares = [
  authAPI.middleware,
  cartAPI.middleware,
  productsAPI.middleware,
  categoriesAPI.middleware,
  brandsAPI.middleware,
  bannersAPI.middleware,
  pagesAPI.middleware,
];

// ============================================
// ایجاد Store با تمام middlewareها
// ============================================
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/PURGE',
          'persist/FLUSH',
        ],
        ignoredActionPaths: [
          'meta.baseQueryMeta.request',
          'meta.baseQueryMeta.response',
          'meta.baseQueryMeta.error',
        ],
        ignoredPaths: ['persist', 'meta'],
        warnAfter: 100,
      },
      immutableCheck: process.env.NODE_ENV !== 'production',
    });
    
    // اضافه کردن همه middlewareها
    return middlewares.concat(allMiddlewares);
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// ============================================
// Export‌های اصلی
// ============================================
export const RootState =  store.getState;
export const AppDispatch = store.dispatch;

// ============================================
// توابع کمکی برای Lazy Loading (اختیاری)
// ============================================
export const loadFeature = async (featureName) => {
  // این تابع برای بارگذاری features در صورت نیاز
  // اما با توجه به اینکه همه middlewareها اضافه شده‌اند،
  // فقط برای بارگذاری slices استفاده می‌شود
  console.log(`Feature "${featureName}" already loaded`);
};

export const isFeatureLoaded = (featureName) => {
  const state = store.getState();
  return state && state[featureName] !== undefined;
};