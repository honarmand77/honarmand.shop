// src/features/banners/bannersAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BANNERS } from '../../api/endpoints';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.honarmand.shop/wp-json';

// ============================================
// تنظیمات پایه
// ============================================
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  timeout: 15000,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// ============================================
// تابع کمکی برای تبدیل پاسخ
// ============================================
const transformBannerResponse = (response) => {
  if (response?.data && Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response)) {
    return response;
  }
  return [];
};

// ============================================
// API بهینه‌شده
// ============================================
export const bannersAPI = createApi({
  reducerPath: 'bannersAPI',
  baseQuery,
  tagTypes: ['Banners'],
  keepUnusedDataFor: 120, // کش ۲ دقیقه‌ای
  refetchOnMountOrArgChange: 60,
  endpoints: (builder) => ({
    // بنرهای اسلایدر
    getSliderBanners: builder.query({
      query: () => BANNERS.SLIDER,
      providesTags: ['Banners'],
      transformResponse: transformBannerResponse,
      // اولویت بالا برای بارگذاری سریع
      keepUnusedDataFor: 180,
    }),

    // بنرهای کوچک
    getSmallBanners: builder.query({
      query: () => BANNERS.SMALL,
      providesTags: ['Banners'],
      transformResponse: transformBannerResponse,
      keepUnusedDataFor: 180,
    }),

    // بنرهای تایمر
    getTimerBanners: builder.query({
      query: () => BANNERS.TIMER,
      providesTags: ['Banners'],
      transformResponse: transformBannerResponse,
    }),

    // پیشنهاد هفته
    getDealOfWeek: builder.query({
      query: () => BANNERS.DEAL_OF_WEEK,
      providesTags: ['Banners'],
      transformResponse: (response) => {
        const data = transformBannerResponse(response);
        return data.find(b => Number(b.collection_id) === 6) || null;
      },
      keepUnusedDataFor: 300, // کش ۵ دقیقه‌ای
    }),

    // بنرهای کالکشن
    getCollectionBanners: builder.query({
      query: () => BANNERS.COLLECTION,
      providesTags: ['Banners'],
      transformResponse: transformBannerResponse,
    }),

    // بنرهای محبوب
    getPopularBanners: builder.query({
      query: () => BANNERS.POPULAR,
      providesTags: ['Banners'],
      transformResponse: transformBannerResponse,
    }),

    // دریافت بنر با شناسه
    getBannerById: builder.query({
      query: (id) => BANNERS.SINGLE(id),
      providesTags: (result, error, id) => [{ type: 'Banners', id }],
      keepUnusedDataFor: 300,
    }),

    // بنرهای فعال
    getActiveBanners: builder.query({
      query: ({ type = 'all', limit = 10 } = {}) => {
        const params = new URLSearchParams({
          status: 'active',
          ...(type !== 'all' && { type }),
          per_page: limit,
        });
        return `/banners?${params}`;
      },
      providesTags: ['Banners'],
      transformResponse: transformBannerResponse,
      keepUnusedDataFor: 120,
    }),
  }),
});

export const {
  useGetSliderBannersQuery,
  useGetSmallBannersQuery,
  useGetTimerBannersQuery,
  useGetDealOfWeekQuery,
  useGetCollectionBannersQuery,
  useGetPopularBannersQuery,
  useGetBannerByIdQuery,
  useGetActiveBannersQuery,
} = bannersAPI;