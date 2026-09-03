// src/components/footer/Footer.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // ✅ اضافه شد
import { 
  ShoppingBag, 
  Home, 
  User, 
  Phone, 
  MessageCircle,
  Heart,
  Store,
  Mail,
  MapPin,
  ChevronUp,
  Link as LinkIcon,
  Info,
  Headphones,
  FileText,
  Shield,
  Truck,
  Gift,
  Sparkles,
  TrendingUp,
  Package,
  Folder,
  HelpCircle,
  Settings,
  LogIn,
  UserPlus
} from "lucide-react";
import Logo from '../../../assets/icons/Logo';
import { cn } from '../../../utils/utils';
// ❌ حذف: import { useShop } from '../../../pages/store/hooks/useShop';
import { useGetCategoriesQuery } from '../../../features/categories/categoriesAPI'; // ✅ برای منوها

export function Footer() {
  const dispatch = useDispatch();
  
  // ✅ دریافت اطلاعات از Redux
  const { totalItems: cartCount } = useSelector((state) => state.cart);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);
  
  // ✅ دریافت دسته‌بندی‌ها از API (اگر نیاز داری)
  const { data: categoriesData, isLoading: categoriesApiLoading } = useGetCategoriesQuery({ perPage: 50 });

  // State
  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // ===== Effects =====
  
  // تشخیص موبایل و اسکرول
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // ===== Handlers =====
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch('/api/user-shop/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage("✅ ایمیل شما با موفقیت ثبت شد");
        setEmail("");
        setTimeout(() => setSubmitMessage(""), 5000);
      } else {
        setSubmitMessage(data.message || "❌ خطا در ثبت ایمیل");
      }
    } catch (error) {
      setSubmitMessage("❌ خطا در ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(""), 5000);
    }
  };

  // ===== Utility Functions =====
  
  const normalizeMenuUrl = useCallback((url) => {
    if (!url || url === '#' || url === '') return '#';
    
    let cleanUrl = url;
    
    // حذف دامنه
    if (url.includes('api.honarmand.shop')) {
      cleanUrl = url.replace(/https?:\/\/api\.honarmand\.shop\/?/, '') || '/';
    }
    if (url.includes('honarmand.shop')) {
      cleanUrl = url.replace(/https?:\/\/honarmand\.shop\/?/, '') || '/';
    }
    
    // حذف اسلش انتهایی
    cleanUrl = cleanUrl.replace(/\/$/, '');
    
    // اطمینان از وجود / در ابتدا
    if (!cleanUrl.startsWith('/')) {
      cleanUrl = `/${cleanUrl}`;
    }
    
    if (cleanUrl === '') {
      cleanUrl = '/';
    }
    
    return cleanUrl;
  }, []);

  const getMenuIcon = useCallback((title) => {
    const titleLower = title?.toLowerCase() || '';

    const iconMap = {
      'فروشگاه': Store,
      'store': Store,
      'shop': Store,
      'پر فروش': TrendingUp,
      'پرفروش': TrendingUp,
      'شگفت': Sparkles,
      'شگفت‌انگیز': Sparkles,
      'خانه': Home,
      'home': Home,
      'درباره': Info,
      'about': Info,
      'تماس': Headphones,
      'contact': Headphones,
      'سبد خرید': ShoppingBag,
      'cart': ShoppingBag,
      'محصول': Package,
      'product': Package,
      'تخفیف': Gift,
      'discount': Gift,
      'پروفایل': User,
      'profile': User,
      'ورود': LogIn,
      'login': LogIn,
      'ثبت نام': UserPlus,
      'register': UserPlus,
      'علاقه': Heart,
      'wishlist': Heart,
      'ارسال': Truck,
      'delivery': Truck,
      'قوانین': Shield,
      'rules': Shield,
      'تنظیمات': Settings,
      'settings': Settings,
      'راهنما': HelpCircle,
      'help': HelpCircle,
      'سفارش': FileText,
      'order': FileText,
      'دسته': Folder,
      'category': Folder,
    };

    for (const [key, Icon] of Object.entries(iconMap)) {
      if (titleLower.includes(key)) {
        return <Icon className="h-4 w-4 ml-2 flex-shrink-0" />;
      }
    }

    return <LinkIcon className="h-4 w-4 ml-2 flex-shrink-0" />;
  }, []);

  // ===== Memoized Data =====
  
  // ✅ منوی فوتر از دسته‌بندی‌ها (به جای useShop)
  const footerMenuItems = useMemo(() => {
    const items = [];
    
    // دسته‌بندی‌های اصلی
    if (categoriesData && categoriesData.length > 0) {
      // فقط دسته‌بندی‌های سطح اول (بدون والد)
      const topCategories = categoriesData.filter(cat => cat.parent === 0);
      items.push(...topCategories.map(cat => ({
        id: cat.id,
        title: cat.name,
        url: `/دسته-بندی/${cat.slug}`,
        type: 'category'
      })));
    }
    
    // اضافه کردن لینک‌های ثابت
    const staticLinks = [
      { id: 'home', title: 'خانه', url: '/' },
      { id: 'store', title: 'فروشگاه', url: '/فروشگاه' },
      { id: 'about', title: 'درباره ما', url: '/درباره-ما' },
      { id: 'contact', title: 'تماس با ما', url: '/تماس-با-ما' },
      { id: 'faq', title: 'سوالات متداول', url: '/سوالات-متداول' },
    ];
    
    items.push(...staticLinks);
    
    return items;
  }, [categoriesData]);

  // تقسیم منو به ستون‌ها
  const menuColumns = useMemo(() => {
    const columns = 3;
    const result = [];
    const itemsPerColumn = Math.ceil(footerMenuItems.length / columns);
    
    for (let i = 0; i < footerMenuItems.length; i += itemsPerColumn) {
      result.push(footerMenuItems.slice(i, i + itemsPerColumn));
    }
    
    return result;
  }, [footerMenuItems]);

  // اطلاعات فروشگاه (از localStorage یا state)
  const shopData = useMemo(() => {
    try {
      const saved = localStorage.getItem('shopInfo');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading shop info:', e);
    }
    return {};
  }, []);

  const brand = useMemo(() => ({
    name: shopData.name || shopData.shop_name || "فروشگاه هنرمند",
    logo: shopData.logo || shopData.shop_logo || "",
    description: shopData.description || shopData.shop_description || "فروشگاه آنلاین هنرمند",
    phone: shopData.phone || shopData.shop_phone || "",
    email: shopData.email || shopData.shop_email || "",
    address: shopData.address || shopData.shop_address || "",
    appStore: shopData.app_store_link || "#",
    googlePlay: shopData.google_play_link || "#",
  }), [shopData]);

  const mobileNav = useMemo(() => [
    { label: "خانه", icon: Home, href: "/" },
    { label: "فروشگاه", icon: Store, href: "/فروشگاه" },
    { label: "سبد خرید", icon: ShoppingBag, href: "/سبد-خرید", badge: cartCount },
    { label: "علاقه‌مندی", icon: Heart, href: "/علاقه-مندی" },
    { label: "پروفایل", icon: User, href: "/پروفایل" }
  ], [cartCount]);

  const mobileActions = useMemo(() => [
    { 
      label: "تماس", 
      icon: Phone, 
      href: 'tel:+989999910764',
      isExternal: true
    },
    { 
      label: "واتساپ", 
      icon: MessageCircle, 
      href: 'https://wa.me/989999910764',
      isExternal: true,
      rel: "noopener noreferrer"
    }
  ], []);

  // ===== Render Functions =====
  
  const renderSocialLinks = useCallback(() => {
    // شبکه‌های اجتماعی از shopData
    const socialLinks = [
      { title: 'اینستاگرام', url: shopData.instagram || '#', icon: '📸', color: '#E4405F' },
      { title: 'واتساپ', url: shopData.whatsapp || '#', icon: '💬', color: '#25D366' },
      { title: 'تلگرام', url: shopData.telegram || '#', icon: '📱', color: '#0088cc' },
      { title: 'ایتا', url: shopData.ita || '#', icon: '💠', color: '#7B3F00' },
    ].filter(link => link.url && link.url !== '#');

    if (socialLinks.length === 0) {
      return <span className="text-sm text-muted-foreground">شبکه‌های اجتماعی</span>;
    }

    return socialLinks.map((social) => (
      <a
        key={social.title}
        href={social.url}
        aria-label={`لینک ${social.title}`}
        className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold text-white transition-all hover:scale-110 hover:opacity-90"
        style={{ backgroundColor: social.color }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {social.icon}
      </a>
    ));
  }, [shopData]);

  // ===== Component =====
  
  const loading = categoriesApiLoading || categoriesLoading;

  return (
    <>
      <footer className="mt-15 border-t border-border bg-card">
        {/* دکمه بازگشت به بالا */}
        <div className="relative">
          <button
            onClick={scrollToTop}
            className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            aria-label="بازگشت به بالا"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {/* بخش برند */}
            <div className="col-span-1 lg:col-span-1">
              <Link to="/" className="mb-4 flex items-center gap-2">
                <span className="flex h-15 w-30 items-center justify-center rounded-md">
                  <Logo />
                </span>
              </Link>
              
              <p className="mb-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {brand.description}
              </p>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                {brand.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href={`tel:${brand.phone}`} className="hover:text-primary transition-colors">
                      {brand.phone}
                    </a>
                  </p>
                )}
                {brand.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${brand.email}`} className="hover:text-primary transition-colors">
                      {brand.email}
                    </a>
                  </p>
                )}
                {brand.address && (
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{brand.address}</span>
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-3 flex-wrap">
                <a 
                  href={brand.appStore}
                  className="rounded-md bg-foreground px-3 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
                >
                  اپ استور
                </a>
                <a 
                  href={brand.googlePlay}
                  className="rounded-md bg-foreground px-3 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
                >
                  گوگل پلی
                </a>
              </div>
            </div>

            {/* منوها */}
            {loading ? (
              <div className="col-span-3 flex items-center gap-2 text-muted-foreground">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                در حال بارگذاری منوها...
              </div>
            ) : footerMenuItems.length === 0 ? (
              <div className="col-span-3 text-muted-foreground">منویی یافت نشد</div>
            ) : (
              menuColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="col-span-1">
                  <ul className="space-y-3">
                    {column.map((item) => {
                      const icon = getMenuIcon(item.title);
                      const isExternal = item.url?.startsWith('http') || item.url?.startsWith('https');
                      
                      if (isExternal) {
                        return (
                          <li key={item.id}>
                            <a
                              href={item.url}
                              className="flex items-center text-sm text-muted-foreground transition-colors hover:text-primary group"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {icon}
                              <span>{item.title}</span>
                            </a>
                          </li>
                        );
                      }
                      
                      return (
                        <li key={item.id}>
                          <Link
                            to={item.url}
                            className="flex items-center text-sm text-muted-foreground transition-colors hover:text-primary group"
                          >
                            {icon}
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}

            {/* بخش خبرنامه */}
            <div className="col-span-1 lg:col-span-1">
              <h4 className="mb-4 text-sm font-bold text-foreground">خبرنامه</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                برای دریافت آخرین تخفیف‌ها و به‌روزرسانی‌ها عضو شوید.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex overflow-hidden rounded-md border border-border bg-background">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                  dir="rtl"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 whitespace-nowrap disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "..." : "ثبت"}
                </button>
              </form>
              {submitMessage && (
                <p className={`mt-2 text-sm ${submitMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {submitMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* نوار پایین */}
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row md:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {renderSocialLinks()}
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              {shopData.copyright || "تمامی حقوق این وب‌سایت محفوظ می‌باشد"} © {new Date().getFullYear()}
            </p>
            
            <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground justify-center">
              {shopData.payment_methods && shopData.payment_methods.length > 0 ? (
                shopData.payment_methods.map((method) => (
                  <span key={method} className="px-2 py-1 bg-muted rounded-md">
                    {method}
                  </span>
                ))
              ) : (
                <>
                  <span className="px-2 py-1 bg-muted rounded-md">زرین‌پال</span>
                  <span className="px-2 py-1 bg-muted rounded-md">پی‌پال</span>
                  <span className="px-2 py-1 bg-muted rounded-md">مسترکارت</span>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* فوتر موبایل */}
      {isMobile && (
        <>
          {/* دکمه‌های اکشن */}
          <div className={`fixed bottom-25 left-0 z-40 grid justify-center gap-4 p-2 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-20'}`}>
            {mobileActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex h-10 w-10 items-center gap-2 rounded-full bg-popover p-3 text-sm font-medium text-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                target={action.isExternal ? "_blank" : undefined}
                rel={action.isExternal ? (action.rel || "noopener noreferrer") : undefined}
              >
                <action.icon className="h-10 w-10" />
              </a>
            ))}
          </div>

          {/* ناوبری موبایل */}
          <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex items-center justify-around px-2 py-1.5">
              {mobileNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="relative flex flex-col items-center gap-1 px-3 py-1.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.badge ? (
                    <div className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse'>
                      <span>{item.badge > 99 ? '99+' : item.badge}</span>
                    </div>
                  ) : null}
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </>
  );
}

export default Footer;