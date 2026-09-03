// src/features/categories/categoriesAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PRODUCT_CATEGORIES } from '../../api/endpoints';

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
// تابع کمکی برای تبدیل دسته‌بندی‌ها
// ============================================
const transformCategories = (response) => {
  if (!response) return [];
  
  let categories = [];
  if (response?.data && Array.isArray(response.data)) {
    categories = response.data;
  } else if (Array.isArray(response)) {
    categories = response;
  } else {
    return [];
  }

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent || 0,
    image: cat.image?.src || cat.image || null,
    count: cat.count || 0,
    description: cat.description || '',
    // اضافه کردن برای بهینه‌سازی
    link: cat.link || '',
    meta: cat.meta || {},
    menu_order: cat.menu_order || 0,
    display: cat.display || 'default',
  }));
};

// ============================================
// API بهینه‌شده
// ============================================
export const categoriesAPI = createApi({
  reducerPath: 'categoriesAPI',
  baseQuery,
  tagTypes: ['Categories'],
  keepUnusedDataFor: 180, // کش ۳ دقیقه‌ای
  refetchOnMountOrArgChange: 120,
  endpoints: (builder) => ({
    // دریافت همه دسته‌بندی‌ها
    getCategories: builder.query({
      query: ({ 
        perPage = 50, 
        hideEmpty = true,
        parent = 0,
        orderBy = 'name',
        order = 'asc',
      } = {}) => {
        const params = new URLSearchParams({
          per_page: perPage,
          hide_empty: hideEmpty,
          orderby: orderBy,
          order,
          ...(parent && { parent }),
        });
        return `${PRODUCT_CATEGORIES.LIST}?${params}`;
      },
      providesTags: ['Categories'],
      transformResponse: transformCategories,
      keepUnusedDataFor: 300,
    }),

    // دریافت دسته‌بندی با شناسه
    getCategoryById: builder.query({
      query: (id) => PRODUCT_CATEGORIES.SINGLE(id),
      providesTags: (result, error, id) => [{ type: 'Categories', id }],
      transformResponse: (response) => ({
        id: response.id,
        name: response.name,
        slug: response.slug,
        parent: response.parent || 0,
        image: response.image?.src || response.image || null,
        count: response.count || 0,
        description: response.description || '',
        link: response.link || '',
        meta: response.meta || {},
        menu_order: response.menu_order || 0,
        display: response.display || 'default',
      }),
      keepUnusedDataFor: 300,
    }),

    // دریافت زیردسته‌ها
    getCategoryChildren: builder.query({
      query: (parentId) => {
        const params = new URLSearchParams({
          parent: parentId,
          per_page: 50,
          hide_empty: true,
        });
        return `${PRODUCT_CATEGORIES.LIST}?${params}`;
      },
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Categories', id })), { type: 'Categories', id: 'CHILDREN' }] 
        : [{ type: 'Categories', id: 'CHILDREN' }],
      transformResponse: transformCategories,
      keepUnusedDataFor: 300,
    }),

    // دسته‌بندی‌های سطح بالا (بدون والد)
    getTopLevelCategories: builder.query({
      query: ({ perPage = 20 } = {}) => {
        const params = new URLSearchParams({
          parent: 0,
          per_page: perPage,
          hide_empty: true,
        });
        return `${PRODUCT_CATEGORIES.LIST}?${params}`;
      },
      providesTags: ['Categories'],
      transformResponse: transformCategories,
      keepUnusedDataFor: 360,
    }),

    // جستجوی دسته‌بندی‌ها
    searchCategories: builder.query({
      query: ({ search, perPage = 20 } = {}) => {
        const params = new URLSearchParams({
          search: encodeURIComponent(search),
          per_page: perPage,
        });
        return `${PRODUCT_CATEGORIES.LIST}?${params}`;
      },
      providesTags: ['Categories'],
      transformResponse: transformCategories,
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryChildrenQuery,
  useGetTopLevelCategoriesQuery,
  useSearchCategoriesQuery,
  useLazyGetCategoriesQuery,
} = categoriesAPI;