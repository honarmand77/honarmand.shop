// src/features/cart/cartAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CART } from '../../api/endpoints';

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
// API بهینه‌شده
// ============================================
export const cartAPI = createApi({
  reducerPath: 'cartAPI',
  baseQuery,
  tagTypes: ['Cart'],
  keepUnusedDataFor: 30, // کش ۳۰ ثانیه‌ای برای سبد خرید
  refetchOnMountOrArgChange: 10, // رفرش سریع
  endpoints: (builder) => ({
    // دریافت سبد خرید
    getCart: builder.query({
      query: () => CART.GET,
      providesTags: ['Cart'],
      keepUnusedDataFor: 60,
      // بهینه‌سازی: فقط در صورت نیاز رفرش کن
      refetchOnMountOrArgChange: 30,
    }),

    // افزودن به سبد خرید
    addToCart: builder.mutation({
      query: ({ productId, quantity = 1, variation = {} }) => ({
        url: CART.ADD_ITEM,
        method: 'POST',
        body: { 
          product_id: productId, 
          quantity,
          ...(Object.keys(variation).length > 0 && { variation }),
        },
      }),
      invalidatesTags: ['Cart'],
      // بهینه‌سازی: به‌روزرسانی optimistic
      onQueryStarted: async ({ productId, quantity }, { dispatch, queryFulfilled }) => {
        // به‌روزرسانی موقت سبد خرید
        const patchResult = dispatch(
          cartAPI.util.updateQueryData('getCart', undefined, (draft) => {
            // به‌روزرسانی موقت
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // حذف از سبد خرید
    removeFromCart: builder.mutation({
      query: (cartItemKey) => ({
        url: CART.REMOVE_ITEM,
        method: 'POST',
        body: { cart_item_key: cartItemKey },
      }),
      invalidatesTags: ['Cart'],
    }),

    // به‌روزرسانی آیتم سبد خرید
    updateCartItem: builder.mutation({
      query: ({ cartItemKey, quantity }) => ({
        url: CART.UPDATE_ITEM,
        method: 'POST',
        body: { cart_item_key: cartItemKey, quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    // خالی کردن سبد خرید
    clearCart: builder.mutation({
      query: () => ({ 
        url: CART.CLEAR, 
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),

    // اعمال کد تخفیف
    applyCoupon: builder.mutation({
      query: (couponCode) => ({
        url: CART.APPLY_COUPON,
        method: 'POST',
        body: { coupon: couponCode },
      }),
      invalidatesTags: ['Cart'],
    }),

    // حذف کد تخفیف
    removeCoupon: builder.mutation({
      query: (couponCode) => ({
        url: CART.REMOVE_COUPON,
        method: 'POST',
        body: { coupon: couponCode },
      }),
      invalidatesTags: ['Cart'],
    }),

    // محاسبه هزینه ارسال
    calculateShipping: builder.mutation({
      query: (shippingData) => ({
        url: CART.CALCULATE_SHIPPING,
        method: 'POST',
        body: shippingData,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useCalculateShippingMutation,
} = cartAPI;