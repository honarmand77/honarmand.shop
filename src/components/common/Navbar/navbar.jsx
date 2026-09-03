// src/components/common/Navbar/navbar.jsx
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ChevronDown, 
  LayoutGrid, 
  Menu, 
  X, 
  Home, 
  Store, 
  BookOpen, 
  Info, 
  Phone,
  TrendingUp,
  Sparkles,
  MapPin,
  User,
  LogIn,
  UserPlus,
  ShoppingCart,
  Package,
  Gift,
  Heart,
  Truck,
  Shield,
  Settings,
  HelpCircle,
  AlertCircle,
  Folder,
  ArrowLeft,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from '../../ui/Button/Button';
import { Badge } from '../../ui/Badge/Badge';
import { cn } from '../../../utils/utils';
import { useGetCategoriesQuery } from '../../../features/categories/categoriesAPI';

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ دریافت وضعیت از Redux
  const { categories: categoriesState, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { totalItems: cartCount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // ✅ دریافت دسته‌بندی‌ها از API
  const { data: categoriesData, isLoading: categoriesApiLoading, error: categoriesError } = useGetCategoriesQuery({ perPage: 50 });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isScrolled, setIsScrolled] = useState(false); // ✅ جدید

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // تشخیص اسکرول ✅ جدید
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تشخیص موبایل
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // بستن منو هنگام کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // بستن منو هنگام تغییر مسیر
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoriesOpen(false);
    setActiveLink(location.pathname);
  }, [location.pathname]);

  // جلوگیری از اسکرول وقتی منو باز است
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  /**
   * تابع تبدیل آدرس منو از فرمت API به فرمت صحیح فرانت‌اند
   */
  const normalizeMenuUrl = useCallback((url) => {
    if (!url) return '#';
    
    if (url === '#' || url === '') return '#';
    
    if (url.includes('api.honarmand.shop')) {
      const cleanUrl = url.replace(/https?:\/\/api\.honarmand\.shop\/?/, '/');
      return cleanUrl || '/';
    }
    
    if (url.includes('honarmand.shop')) {
      const cleanUrl = url.replace(/https?:\/\/honarmand\.shop\/?/, '/');
      return cleanUrl || '/';
    }
    
    if (url.startsWith('/')) {
      return url;
    }
    
    if (!url.includes('http') && !url.includes('://')) {
      return `/${url}`;
    }
    
    return url;
  }, []);

  /**
   * تابع تبدیل آیتم منو به لینک با حفاظت از داده‌های ناموجود
   */
  const renderMenuItem = useCallback((item) => {
    if (!item) return { url: '#', title: 'لینک' };
    
    const url = item.url || item.href || '#';
    const title = item.title || item.label || item.name || 'لینک';
    const normalizedUrl = normalizeMenuUrl(url);
    
    return { url: normalizedUrl, title };
  }, [normalizeMenuUrl]);

  /**
   * دریافت آیکون مناسب برای آیتم منو
   */
  const getMenuIcon = useCallback((title) => {
    const titleLower = title?.toLowerCase() || '';
    
    if (titleLower.includes('فروشگاه') || titleLower.includes('store')) {
      return <Store className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('پر فروش') || titleLower.includes('پرفروش')) {
      return <TrendingUp className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('شگفت') || titleLower.includes('شگفت‌انگیز')) {
      return <Sparkles className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('انتخاب شهر') || titleLower.includes('شهر')) {
      return <MapPin className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('خانه') || titleLower.includes('home')) {
      return <Home className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('درباره') || titleLower.includes('about')) {
      return <Info className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('تماس') || titleLower.includes('contact')) {
      return <Phone className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('سبد خرید') || titleLower.includes('cart')) {
      return <ShoppingCart className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('محصول') || titleLower.includes('product')) {
      return <Package className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('تخفیف') || titleLower.includes('discount')) {
      return <Gift className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('پروفایل') || titleLower.includes('profile')) {
      return <User className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('ورود') || titleLower.includes('login')) {
      return <LogIn className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('ثبت نام') || titleLower.includes('register')) {
      return <UserPlus className="h-4 w-4 ml-2 flex-shrink-0" />;
    }
    if (titleLower.includes('علاقه') || titleLower.includes('wishlist')) {
      return <Heart className="h-4 w-4 ml-2 flex-shrink-0" />;
    }

    // آیکون پیش‌فرض
    return <LinkIcon className="h-4 w-4 ml-2 flex-shrink-0" />;
  }, []);

  // ✅ منوی هدر (استاتیک یا از state)
  const headerMenu = useMemo(() => {
    return [
      { id: 2, title: 'فروشگاه', url: '/فروشگاه' },
      { id: 3, title: 'پر فروش ترین ها', url: '/پر-فروش-ترین-ها' },
      { id: 4, title: 'شگفت انگیز', url: '/شگفت-انگیز' },
      { id: 5, title: 'انتخاب شهر', url: '/انتخاب-شهر' },
      ...(isAuthenticated 
        ? [{ id: 6, title: 'پروفایل', url: '/پروفایل' }]
        : [
            { id: 8, title: 'ثبت نام', url: '/ثبت-نام' },
          ]
      ),
    ];
  }, [isAuthenticated]);

  // ✅ دسته‌بندی‌ها - استفاده از داده‌های API
  const categories = useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      return categoriesData;
    }
    return categoriesState || [];
  }, [categoriesData, categoriesState]);

  const isLoading = categoriesApiLoading || categoriesLoading;
  const hasError = categoriesError;

  // بررسی فعال بودن لینک
  const isLinkActive = useCallback((url) => {
    if (!url || url === '#') return false;
    const normalizedUrl = normalizeMenuUrl(url);
    if (normalizedUrl === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(normalizedUrl);
  }, [location.pathname, normalizeMenuUrl]);



  return (
    <nav 
      className={cn(
        // ✅ کلاس‌های پایه
        'sticky bg-primary-foreground md:top-5 top-0 z-50 border-b',
        // ✅ تغییر ظاهر هنگام اسکرول
        isScrolled 
          ? 'm-auto md:w-7xl w-[100vw] shadow-lg' 
          : ''
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">

        {/* منوی دسته‌بندی‌ها */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="default"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className={cn(
              "flex items-center justify-between gap-2 px-4 py-2.5 transition-all duration-300",
              isScrolled && "shadow-md" // ✅ سایه بیشتر وقتی چسبیده
            )}
          >
            <span className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              {isLoading ? 'در حال بارگذاری...' : 'همه دسته‌بندی‌ها'}
            </span>
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform duration-200',
              isCategoriesOpen && 'rotate-180'
            )} />
          </Button>

          {/* منوی کشویی دسته‌بندی‌ها */}
          {isCategoriesOpen && (
            <div className="absolute rtl right-0 top-full z-20 mt-2 max-h-96 w-64 overflow-y-auto rounded-md border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="mt-2">در حال بارگذاری...</p>
                </div>
              ) : hasError ? (
                <div className="p-4 text-center text-destructive">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>خطا در بارگذاری</p>
                </div>
              ) : !categories || categories.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>هیچ دسته‌بندی‌ای یافت نشد</p>
                </div>
              ) : (
                <>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/دسته-بندی/${category.slug || category.id}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      {category.image && (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="h-6 w-6 rounded object-cover flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <span className="flex-1">{category.name}</span>
                      {category.count && (
                        <Badge variant="secondary" size="sm">
                          {category.count}
                        </Badge>
                      )}
                    </Link>
                  ))}
                  <div className="border-t border-border p-2">
                    <Button
                      variant="ghost"
                      className="w-full text-center text-sm font-medium text-primary hover:bg-muted"
                      onClick={() => {
                        setIsCategoriesOpen(false);
                        navigate('/all-categories');
                      }}
                    >
                      مشاهده همه دسته‌بندی‌ها
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* لینک‌های ناوبری - دسکتاپ */}
        <ul className="hidden lg:flex flex-wrap items-center gap-x-6 gap-y-2">
          {headerMenu.map((link) => {
            const { url, title } = renderMenuItem(link);
            const icon = getMenuIcon(title);
            const isActive = isLinkActive(url);
            
            return (
              <li key={link.id || title}>
                <Link
                  to={url}
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors relative',
                    'hover:text-primary',
                    isActive 
                      ? 'text-primary' 
                      : isScrolled ? '' : 'text-foreground' // ✅ تغییر رنگ وقتی چسبیده
                  )}
                >
                  {icon}
                  {title}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* لینک‌های ویژه */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {/* می‌توانید دکمه‌های ویژه مانند جستجو یا سبد خرید را اینجا قرار دهید */}
        </div>

        {/* دکمه منو موبایل */}
        <div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden relative"
          aria-label={isMobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          {isMobileMenuOpen && (
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          )}
        </Button>
                <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="lg:hidden relative"
          aria-label='بازگشت'
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>

        </div>
      </div>

      {/* منوی موبایل */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef} 
          className="lg:hidden h-full fixed inset-0 top-[65px] z-100 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="h-full pb-35 w-75 max-w-[80%] bg-card shadow-xl overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-4">
              {/* لینک‌های اصلی */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">
                  منوی اصلی
                </h4>
                {headerMenu.map((link) => {
                  const { url, title } = renderMenuItem(link);
                  const icon = getMenuIcon(title);
                  const isActive = isLinkActive(url);
                  
                  return (
                    <Link
                      key={link.id || title}
                      to={url}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                        'hover:bg-muted hover:text-primary',
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-foreground'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {icon}
                      <span className="flex-1">{title}</span>
                      {isActive && (
                        <Badge variant="default" size="sm">
                          فعال
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* دسته‌بندی‌ها در موبایل */}
              <div className="space-y-2 rtl">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">
                  دسته‌بندی‌ها
                </h4>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground px-3 py-2">
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    در حال بارگذاری...
                  </div>
                ) : !categories || categories.length === 0 ? (
                  <div className="text-sm text-muted-foreground px-3 py-2">دسته‌بندی‌ای یافت نشد</div>
                ) : (
                  categories.slice(0, 10).map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug || category.id}`}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.image && (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="h-6 w-6 rounded object-cover flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <span className="flex-1">{category.name}</span>
                      {category.count && (
                        <Badge variant="secondary" size="sm">
                          {category.count}
                        </Badge>
                      )}
                    </Link>
                  ))
                )}
                {categories && categories.length > 10 && (
                  <Button
                    variant="ghost"
                    className="w-full text-center text-sm font-medium text-primary hover:bg-muted"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/all-categories');
                    }}
                  >
                    مشاهده همه ({categories.length})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;