// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectAuth } from '../features/auth/authSlice';

const ProtectedRoute = () => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  
  // ============================================
  // ✅ دریافت از Redux
  // ============================================
  const { isAuthenticated, isLoading } = useSelector(selectAuth);
  
  // ============================================
  // ✅ بررسی localStorage
  // ============================================
  const token = localStorage.getItem('authToken');
  const hasToken = !!token;
  
  // ============================================
  // ✅ ترکیب هر دو
  // ============================================
  const isAuth = isAuthenticated || hasToken;

  useEffect(() => {
    console.log('🔐 ProtectedRoute Debug:');
    console.log('  - isAuthenticated (Redux):', isAuthenticated);
    console.log('  - hasToken (localStorage):', hasToken);
    console.log('  - token value:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('  - isAuth:', isAuth);
    console.log('  - isLoading:', isLoading);
    console.log('  - location:', location.pathname);
    
    // ✅ اگر بارگذاری تمام شد یا توکن وجود دارد
    if (!isLoading || hasToken) {
      setChecking(false);
    }
  }, [isAuthenticated, isLoading, hasToken, isAuth, location, token]);

  // ============================================
  // در حال بررسی
  // ============================================
  if (isLoading && !hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // ✅ اگر احراز هویت نشده (هم Redux و هم localStorage)
  // ============================================
  if (!isAuth) {
    console.log('🔐 ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/ورود" state={{ from: location }} replace />;
  }

  // ============================================
  // ✅ احراز هویت شده
  // ============================================
  console.log('🔐 ProtectedRoute - Authenticated, rendering outlet');
  return <Outlet />;
};

export default ProtectedRoute;