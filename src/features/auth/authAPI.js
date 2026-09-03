// src/features/auth/authAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getToken = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  return token.startsWith('Bearer ') ? token.substring(7) : token;
};

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.honarmand.shop/wp-json',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ============================================
    // 1. ارسال OTP
    // ============================================
    sendOTP: builder.mutation({
      query: (phone) => ({
        url: '/auth/v1/send-otp',
        method: 'POST',
        body: { phone },
      }),
    }),

    // ============================================
    // 2. تایید OTP
    // ============================================
    verifyOTP: builder.mutation({
      query: ({ phone, code }) => ({
        url: '/auth/v1/verify-otp',
        method: 'POST',
        body: { phone, code },
      }),
      transformResponse: (response) => {
        // ذخیره توکن
        if (response?.data?.token) {
          localStorage.setItem('auth_token', response.data.token);
        } else if (response?.token) {
          localStorage.setItem('auth_token', response.token);
        }
        
        // ذخیره اطلاعات کاربر
        if (response?.data?.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
        } else if (response?.user) {
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }
        
        return response;
      },
    }),

    // ============================================
    // 3. ثبت نام
    // ============================================
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/v1/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response) => {
        // ذخیره توکن بعد از ثبت نام
        if (response?.data?.token) {
          localStorage.setItem('auth_token', response.data.token);
        } else if (response?.token) {
          localStorage.setItem('auth_token', response.token);
        }
        
        // ذخیره اطلاعات کاربر
        if (response?.data?.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
        } else if (response?.user) {
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }
        
        return response;
      },
    }),

    // ============================================
    // 4. فراموشی رمز عبور
    // ============================================
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/v1/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    // ============================================
    // 5. بازنشانی رمز عبور
    // ============================================
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: '/auth/v1/reset-password',
        method: 'POST',
        body: { token, password },
      }),
    }),

    // ============================================
    // 6. دریافت اطلاعات کاربر فعلی
    // ============================================
    getCurrentUser: builder.query({
      query: () => '/auth/v1/me',
      transformResponse: (response) => {
        if (response?.success && response?.user) {
          localStorage.setItem('user_data', JSON.stringify(response.user));
          return response.user;
        }
        return null;
      },
    }),

    // ============================================
    // 7. خروج از حساب
    // ============================================
    logout: builder.mutation({
      query: () => ({
        url: '/auth/v1/logout',
        method: 'POST',
      }),
      transformResponse: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        return { success: true };
      },
    }),

    // ============================================
    // 8. تازه‌سازی توکن
    // ============================================
    refreshToken: builder.mutation({
      query: () => ({
        url: '/auth/v1/refresh',
        method: 'POST',
      }),
      transformResponse: (response) => {
        if (response?.token) {
          localStorage.setItem('auth_token', response.token);
        }
        return response;
      },
    }),
  }),
});

// ============================================
// Export کردن تمام hooks
// ============================================
export const {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useRegisterMutation,        // ✅ اضافه شد
  useForgotPasswordMutation,  // ✅ اضافه شد
  useResetPasswordMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authAPI;