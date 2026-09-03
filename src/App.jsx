// src/App.jsx
import { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useGetCurrentUserQuery } from './features/auth/authAPI';
import { logout, setAuthenticated, selectAuth } from './features/auth/authSlice';
import { useGetCategoriesQuery } from './features/categories/categoriesAPI';
import Footer from './components/common/Footer/footer';
import Header from './components/common/Header/header';
const AppRoutes = lazy(() => import('./routes/routes'));
import { ScrollToTop } from './ScrollToTop';

function App() {
  const dispatch = useDispatch();
  
  // ✅ استفاده از selector
  const { isAuthenticated } = useSelector(selectAuth);

  // دریافت دسته‌بندی‌ها
  useGetCategoriesQuery({ perPage: 50 });

  // ============================================
  // دریافت اطلاعات کاربر با RTK Query
  // ============================================
  const { 
    data: userData, 
    isLoading: isUserLoading, 
    isError, 
    error,
    refetch 
  } = useGetCurrentUserQuery(undefined, {
    // ✅ اگر توکن وجود دارد، درخواست بده
    skip: !localStorage.getItem('auth_token'),
  });

  // ============================================
  // همگام‌سازی user با Redux
  // ============================================
  useEffect(() => {
    if (userData) {
      dispatch(setAuthenticated(userData));
    }
  }, [userData, dispatch]);

  // ============================================
  // مدیریت خطای احراز هویت
  // ============================================
  useEffect(() => {
    if (isError && error?.status === 401) {
      dispatch(logout());
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_token_expiry');
    }
  }, [isError, error, dispatch]);

  // ============================================
  // بررسی وضعیت احراز هویت در شروع برنامه
  // ============================================
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    const tokenExpiry = localStorage.getItem('auth_token_expiry');
    
    console.log('🔍 App - authToken:', authToken ? '✅ exists' : '❌ not found');
    console.log('🔍 App - isAuthenticated:', isAuthenticated);
    
    // اگر توکن منقضی شده باشد
    if (authToken && tokenExpiry) {
      const now = Date.now();
      if (now > parseInt(tokenExpiry)) {
        console.log('🔍 App - Token expired');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token_expiry');
        dispatch(logout());
        return;
      }
    }
    
    // اگر توکن وجود دارد و کاربر در Redux نیست، دریافت کن
    if (authToken && !isAuthenticated && !isUserLoading) {
      console.log('🔍 App - Refetching user data');
      refetch();
    }
  }, [dispatch, isAuthenticated, isUserLoading, refetch]);

  // ============================================
  // بررسی تم سیستم
  // ============================================
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <ScrollToTop />
          <AppRoutes />
      </main>
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#22c55e',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;