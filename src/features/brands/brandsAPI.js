// src/features/brands/brandsAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BRANDS } from '../../api/endpoints';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.honarmand.shop/wp-json';

// ============================================
// تنظیمات پایه
// ============================================
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  timeout: 8000,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// ============================================
// تابع کمکی برای تبدیل برندها
// ============================================
const transformBrands = (response) => {
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
    image: cat.image?.src || cat.image || null,
    count: cat.count || 0,
    description: cat.description || '',
    featured: cat.featured || false,
    parent: cat.parent || 0,
    // اضافه کردن برای بهینه‌سازی
    link: cat.link || '',
    meta: cat.meta || {},
  }));
};

// ============================================
// API بهینه‌شده
// ============================================
export const brandsAPI = createApi({
  reducerPath: 'brandsAPI',
  baseQuery,
  tagTypes: ['Brands'],
  keepUnusedDataFor: 180, // کش ۳ دقیقه‌ای
  refetchOnMountOrArgChange: 120,
  endpoints: (builder) => ({
    // دریافت همه برندها
    getBrands: builder.query({
      query: ({ perPage = 50, hideEmpty = true } = {}) => ({
        url: `${BRANDS.LIST}?per_page=${perPage}&hide_empty=${hideEmpty}`,
      }),
      providesTags: ['Brands'],
      transformResponse: transformBrands,
      keepUnusedDataFor: 300,
    }),

    // دریافت برند با شناسه
    getBrandById: builder.query({
      query: (id) => `${BRANDS.SINGLE(id)}`,
      providesTags: (result, error, id) => [{ type: 'Brands', id }],
      transformResponse: (response) => ({
        id: response.id,
        name: response.name,
        slug: response.slug,
        image: response.image?.src || response.image || null,
        count: response.count || 0,
        description: response.description || '',
        featured: response.featured || false,
        parent: response.parent || 0,
        link: response.link || '',
        meta: response.meta || {},
      }),
      keepUnusedDataFor: 300,
    }),

    // دریافت برندهای ویژه
    getFeaturedBrands: builder.query({
      query: ({ perPage = 10 } = {}) => ({
        url: `${BRANDS.LIST}?per_page=${perPage}&hide_empty=true`,
      }),
      providesTags: ['Brands'],
      transformResponse: (response) => {
        const brands = transformBrands(response);
        return brands
          .filter((brand) => brand.count > 0)
          .slice(0, perPage)
          .map((brand) => ({
            ...brand,
            featured: brand.count > 5 || brand.featured || false,
          }));
      },
      keepUnusedDataFor: 300,
    }),

    // جستجوی برندها
    searchBrands: builder.query({
      query: ({ search, perPage = 20 } = {}) => ({
        url: `${BRANDS.LIST}?search=${encodeURIComponent(search)}&per_page=${perPage}`,
      }),
      providesTags: ['Brands'],
      transformResponse: transformBrands,
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useGetFeaturedBrandsQuery,
  useSearchBrandsQuery,
} = brandsAPI;