// src/routes/routes.jsx
import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// ============================================
// Lazy Loading
// ============================================
const Home = lazy(() => import('../pages/home/home'));
const Store = lazy(() => import('../pages/store/store'));
const ProductDetail = lazy(() => import('../pages/ProductDetail/ProductDetail'));
const Cart = lazy(() => import('../pages/cart/cart'));
const Checkout = lazy(() => import('../pages/Checkout/Checkout'));
const ContactUs = lazy(() => import('../pages/contactus/contactus'));
const Profile = lazy(() => import('../pages/profile/profile'));

// ✅ Login و Register در pages/auth
const Login = lazy(() => import('../pages/auth/login'));
const Register = lazy(() => import('../pages/auth/signin'));
const Category = lazy(() => import('../pages/category/category'));
const Page = lazy(() => import('../pages/page/page'));
const BestSellers = lazy(() => import('../pages/best-sellers/best-sellers'));
const Amazing = lazy(() => import('../pages/amazing/amazing'));
const CitySelection = lazy(() => import('../pages/city-selection/city-selection'));
const Logout = lazy(() => import('../pages/auth/Logout'));
const LostPassword = lazy(() => import('../pages/auth/LostPassword'));
const Collections = lazy(() => import('../pages/collections/Collections'));
const About = lazy(() => import('../pages/About/About'));

// ============================================
// کامپوننت 404
// ============================================
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h1 className="text-6xl font-bold text-gray-300 mb-4">۴۰۴</h1>
    <h2 className="text-2xl font-semibold text-gray-700 mb-2">صفحه مورد نظر یافت نشد</h2>
    <p className="text-gray-500 mb-6">متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.</p>
    <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      بازگشت به صفحه اصلی
    </a>
  </div>
);

// ============================================
// Spinner
// ============================================
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
    </div>
  </div>
);

// ============================================
// Persian Route Handler
// ============================================
function PersianRouteHandler({ children }) {
  const location = useLocation();
  
  useEffect(() => {
    const currentPath = location.pathname;
    const decodedPath = decodeURIComponent(currentPath);
    
    if (currentPath !== decodedPath && decodedPath !== currentPath) {
      window.history.replaceState(null, '', decodedPath);
    }
  }, [location.pathname]);
  
  return children;
}

// ============================================
// Routes اصلی
// ============================================
export default function AppRoutes() {
  return (
      <PersianRouteHandler>
        <Routes>
          {/* ==========================================
              ✅ مسیرهای عمومی (همه به آن دسترسی دارند)
              ========================================== */}
          <Route path="/" element={<Home />} />
          <Route path="/فروشگاه" element={<Store />} />
          <Route path="/جستجو" element={<Store />} />
          <Route path="/تماس-باما" element={<ContactUs />} />
          <Route path="/ورود" element={<Login />} />
          <Route path="/ثبت-نام" element={<Register />} />
          <Route path="/فراموشی-گذرواژه" element={<LostPassword />} />
          <Route path="/بیرون-رفتن" element={<Logout />} />
          
          {/* ✅ سبد خرید در مسیرهای عمومی */}
          <Route path="/سبد-خرید" element={<Cart />} />
          
          {/* Store Routes */}
          <Route path="/پر-فروش-ترین-ها" element={<BestSellers />} />
          <Route path="/شگفت-انگیز" element={<Amazing />} />
          <Route path="/انتخاب-شهر" element={<CitySelection />} />
          <Route path="/درباره-ما" element={<About />} />
          <Route path="/مجموعه-ها" element={<Collections />} />
          
          {/* Dynamic Routes */}
          <Route path="/محصولات/:id" element={<ProductDetail />} />
          <Route path="/دسته-بندی/:name" element={<Category />} />
          <Route path="/صفحه/:slug" element={<Page />} />

          {/* ==========================================
              🔒 مسیرهای محافظت شده (نیاز به احراز هویت)
              ========================================== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/پروفایل" element={<Profile />} />
            <Route path="/سفارش‌ها" element={<Profile />} />
            <Route path="/نشانی" element={<Profile />} />
            <Route path="/جزئیات-حساب" element={<Profile />} />
            <Route path="/تسویه-حساب" element={<Checkout />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PersianRouteHandler>
  );
}