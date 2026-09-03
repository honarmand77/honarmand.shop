// src/features/products/productsAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PRODUCTS } from '../../api/endpoints';

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
// تابع کمکی برای تبدیل محصولات
// ============================================
const transformProducts = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.products && Array.isArray(response.products)) return response.products;
  return [];
};

// ============================================
// API بهینه‌شده
// ============================================
export const productsAPI = createApi({
  reducerPath: 'productsAPI',
  baseQuery,
  tagTypes: ['Products', 'Product'],
  keepUnusedDataFor: 120, // کش ۲ دقیقه‌ای
  refetchOnMountOrArgChange: 60,
  endpoints: (builder) => ({
    // دریافت محصولات با فیلتر
    getProducts: builder.query({
      query: ({ 
        page = 1, 
        perPage = 20, 
        category, 
        search, 
        orderBy = 'date', 
        order = 'desc',
        minPrice,
        maxPrice,
        onSale,
        featured,
        brand,
        tag,
      } = {}) => {
        const params = new URLSearchParams({
          page,
          per_page: perPage,
          orderby: orderBy,
          order,
          ...(category && { category }),
          ...(search && { search }),
          ...(minPrice && { min_price: minPrice }),
          ...(maxPrice && { max_price: maxPrice }),
          ...(onSale && { on_sale: true }),
          ...(featured && { featured: true }),
          ...(brand && { brand }),
          ...(tag && { tag }),
        });
        return `${PRODUCTS.LIST}?${params}`;
      },
      transformResponse: (response, meta) => ({
        products: transformProducts(response),
        total: Number(meta?.response?.headers.get('X-WP-Total')) || 0,
        totalPages: Number(meta?.response?.headers.get('X-WP-TotalPages')) || 0,
      }),
      providesTags: (result) =>
        result?.products
          ? [...result.products.map(({ id }) => ({ type: 'Products', id })), { type: 'Products', id: 'LIST' }]
          : [{ type: 'Products', id: 'LIST' }],
      keepUnusedDataFor: 180,
    }),

    // دریافت محصول با شناسه
    getProductById: builder.query({
      query: (id) => PRODUCTS.SINGLE(id),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 300,
    }),

    // محصولات ویژه
    getFeaturedProducts: builder.query({
      query: ({ perPage = 8 } = {}) => {
        const params = new URLSearchParams({
          featured: true,
          per_page: perPage,
        });
        return `/wc/v3/products?${params}`;
      },
      providesTags: ['Products'],
      transformResponse: transformProducts,
      keepUnusedDataFor: 300,
    }),

    // پرفروش‌ترین‌ها
    getBestSellers: builder.query({
      query: ({ perPage = 8 } = {}) => {
        const params = new URLSearchParams({
          orderby: 'popularity',
          order: 'desc',
          per_page: perPage,
        });
        return `/wc/v3/products?${params}`;
      },
      providesTags: ['Products'],
      transformResponse: transformProducts,
      keepUnusedDataFor: 300,
    }),

    // محصولات با تخفیف
    getProductsOnSale: builder.query({
      query: ({ perPage = 8 } = {}) => {
        const params = new URLSearchParams({
          on_sale: true,
          per_page: perPage,
        });
        return `/wc/v3/products?${params}`;
      },
      providesTags: ['Products'],
      transformResponse: transformProducts,
      keepUnusedDataFor: 180,
    }),

    // محصولات جدید
    getNewProducts: builder.query({
      query: ({ perPage = 8 } = {}) => {
        const params = new URLSearchParams({
          orderby: 'date',
          order: 'desc',
          per_page: perPage,
        });
        return `/wc/v3/products?${params}`;
      },
      providesTags: ['Products'],
      transformResponse: transformProducts,
      keepUnusedDataFor: 120,
    }),

    // جستجوی محصولات
    searchProducts: builder.query({
      query: ({ search, perPage = 20, page = 1 }) =>
        `${PRODUCTS.SEARCH}?search=${encodeURIComponent(search)}&per_page=${perPage}&page=${page}`,
      providesTags: ['Products'],
      transformResponse: (response, meta) => ({
        products: transformProducts(response),
        total: Number(meta?.response?.headers.get('X-WP-Total')) || 0,
        totalPages: Number(meta?.response?.headers.get('X-WP-TotalPages')) || 0,
      }),
      keepUnusedDataFor: 60,
    }),

    // محصولات مرتبط
    getRelatedProducts: builder.query({
      query: ({ productId, perPage = 4 } = {}) => {
        const params = new URLSearchParams({
          per_page: perPage,
          exclude: productId,
        });
        return `/wc/v3/products?${params}`;
      },
      providesTags: (result, error, { productId }) => 
        result ? [{ type: 'Products', id: `related-${productId}` }] : [],
      transformResponse: transformProducts,
      keepUnusedDataFor: 180,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetBestSellersQuery,
  useGetProductsOnSaleQuery,
  useGetNewProductsQuery,
  useSearchProductsQuery,
  useGetRelatedProductsQuery,
  useLazyGetProductsQuery,
} = productsAPI;