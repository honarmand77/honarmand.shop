// src/features/pages/pagesAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.honarmand.shop/wp-json';

// ============================================
// تنظیمات پایه
// ============================================
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  timeout: 10000,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// ============================================
// تابع کمکی برای تبدیل صفحات
// ============================================
const transformPage = (page) => ({
  id: page.id,
  title: page.title?.rendered || page.title || 'بدون عنوان',
  content: page.content?.rendered || page.content || '',
  excerpt: page.excerpt?.rendered || page.excerpt || '',
  slug: page.slug || '',
  status: page.status || 'publish',
  date: page.date || '',
  modified: page.modified || '',
  featured_image: page.featured_media || null,
  author: page.author || 0,
  categories: page.categories || [],
  tags: page.tags || [],
  meta: page.meta || {},
  _links: page._links || {},
  // اضافه کردن برای بهینه‌سازی
  type: page.type || 'page',
  parent: page.parent || 0,
  menu_order: page.menu_order || 0,
});

// ============================================
// API بهینه‌شده
// ============================================
export const pagesAPI = createApi({
  reducerPath: 'pagesAPI',
  baseQuery,
  tagTypes: ['Pages'],
  keepUnusedDataFor: 300, // کش ۵ دقیقه‌ای
  refetchOnMountOrArgChange: 120,
  endpoints: (builder) => ({
    // دریافت همه صفحات
    getPages: builder.query({
      query: ({ 
        perPage = 50, 
        page = 1, 
        search = '',
        orderBy = 'date',
        order = 'desc',
      } = {}) => {
        const params = new URLSearchParams({
          per_page: perPage,
          page,
          orderby: orderBy,
          order,
          ...(search && { search }),
        });
        return `/wp/v2/pages?${params}`;
      },
      providesTags: ['Pages'],
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return response.map(transformPage);
        }
        return [];
      },
      keepUnusedDataFor: 360,
    }),

    // دریافت صفحه با شناسه
    getPageById: builder.query({
      query: (id) => `/wp/v2/pages/${id}`,
      providesTags: (result, error, id) => [{ type: 'Pages', id }],
      transformResponse: transformPage,
      keepUnusedDataFor: 360,
    }),

    // دریافت صفحه با اسلاگ
    getPageBySlug: builder.query({
      query: (slug) => `/wp/v2/pages?slug=${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Pages', id: `slug-${slug}` }],
      transformResponse: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          return transformPage(response[0]);
        }
        return null;
      },
      keepUnusedDataFor: 360,
    }),

    // دریافت صفحات ویژه (منو، فوتر و...)
    getSpecialPages: builder.query({
      query: ({ type = 'menu' } = {}) => {
        const params = new URLSearchParams({
          per_page: 50,
          ...(type === 'menu' && { menu_order: 'asc' }),
          ...(type === 'footer' && { categories: 'footer' }),
        });
        return `/wp/v2/pages?${params}`;
      },
      providesTags: ['Pages'],
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return response.map(transformPage);
        }
        return [];
      },
      keepUnusedDataFor: 600, // کش ۱۰ دقیقه‌ای
    }),
  }),
});

export const {
  useGetPagesQuery,
  useGetPageByIdQuery,
  useGetPageBySlugQuery,
  useGetSpecialPagesQuery,
} = pagesAPI;