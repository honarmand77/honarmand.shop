// src/components/Header/Header.jsx
import { useState, useEffect } from 'react';
import { Heart, Search, ShoppingBag, User, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // ✅ اضافه شد
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Badge } from '../../ui/Badge/Badge';
import Logo from '../../../assets/icons/Logo';
// ❌ حذف: import { useSearch } from '../../../context/SearchContext';
import { setSearch } from '../../../features/products/productsSlice'; // ✅ اضافه شد
import { useGetProductsQuery } from '../../../features/products/productsAPI'; // ✅ برای جستجو

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ دریافت وضعیت از Redux
  const { filters } = useSelector((state) => state.products);
  const { totalItems: cartCount } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // همگام‌سازی searchTerm با Redux
  useEffect(() => {
    if (filters.search) {
      setSearchTerm(filters.search);
    }
  }, [filters.search]);

  // تشخیص موبایل
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // ✅ ذخیره در Redux
    dispatch(setSearch(searchTerm.trim()));

    // اگر در صفحه استور نیستیم به صفحه استور برویم
    if (location.pathname !== '/جستجو' && location.pathname !== '/فروشگاه') {
      navigate('/جستجو');
    }

    // بستن جستجو در موبایل
    if (isMobile) {
      setIsSearchOpen(false);
    }

    // ارسال رویداد برای به‌روزرسانی نتایج (اگر نیاز داری)
    window.dispatchEvent(new CustomEvent('search-performed', { 
      detail: { query: searchTerm.trim() }
    }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(setSearch(''));
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  return (
    <header className="bg-card sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        
        {/* لوگو */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="flex h-10 w-22 items-center justify-center rounded-md stroke-primary-foreground">
            <Logo />
          </span>
        </Link>

        {/* جستجو - دسکتاپ */}
        <div className="hidden md:flex order-last w-full items-center md:order-none md:mx-auto md:max-w-xl md:flex-1">
          <form 
            onSubmit={handleSearchSubmit} 
            className={`
              flex w-full items-center rounded-full transition-all duration-300
              ${isSearchFocused 
                ? 'shadow-md shadow-primary/10' 
                : 'bg-background'
              }
              bg-background pr-4
            `}
          >
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <Input
              id="search-input"
              type="search"
              placeholder="جستجو کنید..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="border-0 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 focus:border-0"
              dir="rtl"
            />
            <Button
              type="submit"
              size="lg"
              className="rounded-full flex-shrink-0"
              disabled={!searchTerm.trim()}
            >
              جستجو
            </Button>
          </form>
        </div>

        {/* دکمه‌های کاربری */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* دکمه جستجو - موبایل */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="جستجو"
              onClick={handleSearchToggle}
              className="relative"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label="علاقه‌مندی‌ها"
            onClick={() => navigate('/علاقه-مندی')}
            className="relative hover:bg-muted transition-colors"
          >
            <Heart className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            aria-label="سبد خرید"
            className="relative hover:bg-muted transition-colors"
            onClick={() => navigate('/سبد-خرید')}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge 
                variant="destructive" 
                size="sm"
                className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold animate-pulse"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            aria-label={isAuthenticated ? 'پروفایل' : 'ورود'}
            onClick={() => navigate(isAuthenticated ? '/پروفایل' : '/ورود')}
            className="hover:bg-muted transition-colors"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* جستجو - موبایل (دراپ‌داون) */}
      {isMobile && isSearchOpen && (
        <div className="border-t border-border bg-card p-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="جستجو کنید..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pr-10 border-border focus:border-primary"
                dir="rtl"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="flex-shrink-0"
              disabled={!searchTerm.trim()}
            >
              جستجو
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(false)}
              aria-label="بستن جستجو"
            >
              <X className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;