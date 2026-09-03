// src/services/endpoints.js - نسخه نهایی کامل و بهینه

/**
 * API Endpoints - نسخه نهایی
 * تمام endpointهای API در یک فایل متمرکز با دسته‌بندی کامل
 */

// ============================================
// بخش احراز هویت (Authentication)
// ============================================
export const AUTH = {
  /** ارسال کد تایید */
  SEND_OTP: '/auth/v1/send-otp',
  /** تایید کد و ورود */
  VERIFY_OTP: '/auth/v1/verify-otp',
  /** ثبت‌نام کاربر جدید */
  REGISTER: '/auth/v1/register',
  /** دریافت اطلاعات کاربر جاری */
  ME: '/auth/v1/me',
  /** خروج از حساب کاربری */
  LOGOUT: '/auth/v1/logout',
  /** تغییر رمز عبور */
  CHANGE_PASSWORD: '/auth/v1/change-password',
  /** به‌روزرسانی پروفایل */
  UPDATE_PROFILE: '/auth/v1/update-profile',
  /** فراموشی رمز عبور */
  FORGOT_PASSWORD: '/auth/v1/forgot-password',
  /** بازنشانی رمز عبور */
  RESET_PASSWORD: '/auth/v1/reset-password',
  /** تازه‌سازی توکن */
  REFRESH_TOKEN: '/auth/v1/refresh-token',
  /** تایید ایمیل */
  VERIFY_EMAIL: '/auth/v1/verify-email',
}

// ============================================
// بخش کاربران (Users)
// ============================================
export const USERS = {
  /** دریافت پروفایل کاربر */
  PROFILE: '/users/profile',
  /** به‌روزرسانی پروفایل */
  UPDATE_PROFILE: '/users/profile',
  /** آپلود آواتار */
  AVATAR: '/users/avatar',
  /** مدیریت آدرس‌ها */
  ADDRESS: '/users/address',
  /** دریافت آدرس خاص */
  ADDRESS_SINGLE: (id) => `/users/address/${id}`,
  /** دریافت لیست سفارشات */
  ORDERS: '/users/orders',
  /** دریافت سفارش خاص */
  ORDER_SINGLE: (id) => `/users/orders/${id}`,
  /** مدیریت لیست علاقه‌مندی‌ها */
  WISHLIST: '/users/wishlist',
  /** دریافت اعلان‌ها */
  NOTIFICATIONS: '/users/notifications',
  /** علامت‌گذاری اعلان به عنوان خوانده شده */
  NOTIFICATION_READ: (id) => `/users/notifications/${id}/read`,
  /** دریافت امتیازات کاربر */
  RATINGS: '/users/ratings',
}

// ============================================
// بخش صفحات (Pages)
// ============================================
export const PAGES = {
  /** دریافت صفحه اصلی */
  HOME: '/wp/v2/pages/home',
  /** دریافت لیست صفحات */
  LIST: '/wp/v2/pages',
  /** دریافت صفحه با شناسه */
  SINGLE: (id) => `/wp/v2/pages/${id}`,
  /** دریافت صفحه با اسلاگ */
  SLUG: (slug) => `/wp/v2/pages/slug/${slug}`,
  /** دریافت صفحات با دسته‌بندی */
  BY_CATEGORY: (category) => `/wp/v2/pages?category=${category}`,
}

// ============================================
// بخش نوشته‌ها (Posts)
// ============================================
export const POSTS = {
  /** دریافت لیست نوشته‌ها */
  LIST: '/wp/v2/posts',
  /** دریافت نوشته با شناسه */
  SINGLE: (id) => `/wp/v2/posts/${id}`,
  /** دریافت نوشته با اسلاگ */
  SLUG: (slug) => `/wp/v2/posts/slug/${slug}`,
  /** دریافت نوشته‌های یک دسته‌بندی */
  BY_CATEGORY: (categoryId) => `/wp/v2/posts?categories=${categoryId}`,
  /** دریافت نوشته‌های یک برچسب */
  BY_TAG: (tagId) => `/wp/v2/posts?tags=${tagId}`,
  /** جستجو در نوشته‌ها */
  SEARCH: '/wp/v2/posts/search',
  /** دریافت نوشته‌های محبوب */
  POPULAR: '/wp/v2/posts/popular',
  /** دریافت نوشته‌های مرتبط */
  RELATED: (id) => `/wp/v2/posts/${id}/related`,
}

// ============================================
// بخش دسته‌بندی محصولات (Product Categories)
// ============================================
export const PRODUCT_CATEGORIES = {
  /** دریافت لیست دسته‌بندی‌ها */
  LIST: '/wc/store/products/categories',
  /** دریافت دسته‌بندی با شناسه */
  SINGLE: (id) => `/wc/store/products/categories/${id}`,
  /** دریافت دسته‌بندی با اسلاگ */
  SLUG: (slug) => `/wc/store/products/categories/slug/${slug}`,
  /** دریافت زیردسته‌ها */
  CHILDREN: (id) => `/wc/store/products/categories/${id}/children`,
  /** دریافت محصولات یک دسته‌بندی */
  PRODUCTS: (id) => `/wc/store/products/categories/${id}/products`,
}

// ============================================
// بخش محصولات (Products)
// ============================================
export const PRODUCTS = {
  /** دریافت لیست محصولات */
  LIST: '/wc/store/products',
  /** دریافت محصول با شناسه */
  SINGLE: (id) => `/wc/store/products/${id}`,
  /** دریافت محصول با اسلاگ */
  SLUG: (slug) => `/wc/store/products/slug/${slug}`,
  /** جستجو در محصولات */
  SEARCH: '/wc/store/products/search',
  /** دریافت محصولات ویژه */
  FEATURED: '/wc/store/products/featured',
  /** دریافت محصولات پرفروش */
  BESTSELLERS: '/wc/store/products/bestsellers',
  /** دریافت محصولات جدید */
  NEW: '/wc/store/products/new',
  /** دریافت محصولات با تخفیف */
  ON_SALE: '/wc/store/products/on-sale',
  /** دریافت محصولات مرتبط */
  RELATED: (id) => `/wc/store/products/${id}/related`,
  /** دریافت محصولات ارتقایی (upsells) */
  UPSELLS: (id) => `/wc/store/products/${id}/upsells`,
  /** دریافت محصولات متقاطع (cross-sells) */
  CROSS_SELLS: (id) => `/wc/store/products/${id}/cross-sells`,
  /** دریافت محصولات با دسته‌بندی */
  BY_CATEGORY: (categoryId) => `/wc/store/products?category=${categoryId}`,
  /** دریافت محصولات با برند */
  BY_BRAND: (brandId) => `/wc/store/products?brand=${brandId}`,
  /** دریافت محصولات با فیلترهای پیشرفته */
  FILTER: '/wc/store/products/filter',
}

// ============================================
// بخش برندها (Brands)
// ============================================
export const BRANDS = {
  /** دریافت لیست برندها */
  LIST: '/wc/store/products/brands',
  /** دریافت برند با شناسه */
  SINGLE: (id) => `/wc/store/products/brands/${id}`,
  /** دریافت برند با اسلاگ */
  SLUG: (slug) => `/wc/store/products/brands/slug/${slug}`,
  /** دریافت محصولات یک برند */
  PRODUCTS: (id) => `/wc/store/products/brands/${id}/products`,
}

// ============================================
// بخش سبد خرید (Cart)
// ============================================
export const CART = {
  /** دریافت سبد خرید */
  GET: '/wc/store/cart',
  /** افزودن آیتم به سبد خرید */
  ADD_ITEM: '/wc/store/cart/add-item',
  /** به‌روزرسانی آیتم */
  UPDATE_ITEM: '/wc/store/cart/update-item',
  /** حذف آیتم از سبد خرید */
  REMOVE_ITEM: '/wc/store/cart/remove-item',
  /** پاک کردن سبد خرید */
  CLEAR: '/wc/store/cart/clear',
  /** اعمال کوپن */
  APPLY_COUPON: '/wc/store/cart/apply-coupon',
  /** حذف کوپن */
  REMOVE_COUPON: '/wc/store/cart/remove-coupon',
  /** به‌روزرسانی اطلاعات مشتری */
  UPDATE_CUSTOMER: '/wc/store/cart/update-customer',
  /** انتخاب روش ارسال */
  SELECT_SHIPPING: '/wc/store/cart/select-shipping-rate',
  /** دریافت مجموع سبد خرید */
  TOTALS: '/wc/store/cart/totals',
  /** محاسبه مالیات */
  CALCULATE_TAXES: '/wc/store/cart/calculate-taxes',
}

// ============================================
// بخش فروشگاه (Store) - برای سازگاری با نسخه قبلی
// ============================================
export const STORE = {
  ...CART,
  CART_ITEMS: '/wc/store/cart/items',
  CHECKOUT: '/wc/store/checkout',
}

// ============================================
// بخش سفارشات (Orders)
// ============================================
export const ORDERS = {
  /** دریافت لیست سفارشات */
  LIST: '/orders',
  /** دریافت سفارش با شناسه */
  SINGLE: (id) => `/orders/${id}`,
  /** ایجاد سفارش جدید */
  CREATE: '/orders',
  /** به‌روزرسانی سفارش */
  UPDATE: (id) => `/orders/${id}`,
  /** لغو سفارش */
  CANCEL: (id) => `/orders/${id}/cancel`,
  /** دریافت وضعیت سفارش */
  STATUS: (id) => `/orders/${id}/status`,
  /** دریافت فاکتور سفارش */
  INVOICE: (id) => `/orders/${id}/invoice`,
}

// ============================================
// بخش علاقه‌مندی‌ها (Wishlist)
// ============================================
export const WISHLIST = {
  /** دریافت لیست علاقه‌مندی‌ها */
  LIST: '/wishlist',
  /** افزودن به علاقه‌مندی‌ها */
  ADD: '/wishlist',
  /** حذف از علاقه‌مندی‌ها */
  REMOVE: (id) => `/wishlist/${id}`,
  /** پاک کردن علاقه‌مندی‌ها */
  CLEAR: '/wishlist/clear',
  /** بررسی وجود در علاقه‌مندی‌ها */
  CHECK: (id) => `/wishlist/check/${id}`,
}

// ============================================
// بخش نظرات و ریتینگ‌ها (Reviews & Ratings)
// ============================================
export const REVIEWS = {
  /**
   * دریافت لیست نظرات یک محصول با صفحه‌بندی
   */
  LIST: (productId, page = 1, perPage = 10) => {
    const params = new URLSearchParams({
      product_id: productId,
      page,
      per_page: perPage,
      status: 'approved',
    })
    return `/wc/store/products/reviews?${params.toString()}`
  },

  /**
   * دریافت خلاصه نظرات یک محصول (آمار)
   */
  SUMMARY: (productId) => {
    const params = new URLSearchParams({
      product_id: productId,
      summary: 'true',
    })
    return `/wc/store/products/reviews/summary?${params.toString()}`
  },

  /**
   * دریافت ریتینگ (امتیاز) یک محصول
   */
  RATING: (productId) => {
    const params = new URLSearchParams({
      product_id: productId,
      type: 'rating',
    })
    return `/wc/store/products/reviews/rating?${params.toString()}`
  },

  /**
   * دریافت ریتینگ کاربر جاری برای یک محصول
   */
  USER_RATING: (productId) => {
    const params = new URLSearchParams({
      product_id: productId,
      user_rating: 'true',
    })
    return `/wc/store/products/reviews/user-rating?${params.toString()}`
  },

  /**
   * ثبت نظر جدید برای محصول
   */
  CREATE: (productId) => {
    const params = new URLSearchParams({
      product_id: productId,
    })
    return `/wc/store/products/reviews?${params.toString()}`
  },

  /**
   * ثبت/به‌روزرسانی ریتینگ (امتیاز) محصول
   */
  RATING_SUBMIT: (productId) => {
    const params = new URLSearchParams({
      product_id: productId,
      type: 'rating',
    })
    return `/wc/store/products/reviews/rating?${params.toString()}`
  },

  /**
   * دریافت ریتینگ‌های یک محصول با جزئیات کامل
   */
  DETAILED: (productId, options = {}) => {
    const params = new URLSearchParams({
      product_id: productId,
      include_rating: 'true',
      include_user_rating: 'true',
      include_distribution: 'true',
      ...options,
    })
    return `/wc/store/products/reviews/detailed?${params.toString()}`
  },

  /**
   * پاسخ به یک نظر
   */
  REPLY: (reviewId) => {
    const params = new URLSearchParams({
      review_id: reviewId,
      type: 'reply',
    })
    return `/wc/store/products/reviews/reply?${params.toString()}`
  },

  /**
   * گزارش نظر نامناسب
   */
  REPORT: (reviewId) => {
    const params = new URLSearchParams({
      review_id: reviewId,
      type: 'report',
    })
    return `/wc/store/products/reviews/report?${params.toString()}`
  },

  /**
   * به‌روزرسانی نظر
   */
  UPDATE: (reviewId) => {
    const params = new URLSearchParams({
      review_id: reviewId,
    })
    return `/wc/store/products/reviews/${reviewId}?${params.toString()}`
  },

  /**
   * حذف نظر
   */
  DELETE: (reviewId) => {
    const params = new URLSearchParams({
      review_id: reviewId,
    })
    return `/wc/store/products/reviews/${reviewId}?${params.toString()}`
  },

  /**
   * دریافت توزیع ریتینگ‌ها (چند نفر چند ستاره داده‌اند)
   */
  DISTRIBUTION: (productId) => {
    const params = new URLSearchParams({
      product_id: productId,
      type: 'distribution',
    })
    return `/wc/store/products/reviews/distribution?${params.toString()}`
  },

  /**
   * دریافت میانگین ریتینگ محصول
   */
  AVERAGE: (productId) => {
    const params = new URLSearchParams({
      product_id: productId,
      type: 'average',
    })
    return `/wc/store/products/reviews/average?${params.toString()}`
  },

  /**
   * دریافت آخرین نظرات یک محصول
   */
  LATEST: (productId, limit = 5) => {
    const params = new URLSearchParams({
      product_id: productId,
      latest: 'true',
      limit,
    })
    return `/wc/store/products/reviews/latest?${params.toString()}`
  },

  /**
   * دریافت نظرات با فیلترهای پیشرفته
   */
  FILTER: (filters = {}) => {
    const params = new URLSearchParams({
      ...filters,
    })
    return `/wc/store/products/reviews/filter?${params.toString()}`
  },
}

// ============================================
// بخش ریتینگ (Rating) - صادرات خلاصه‌شده
// ============================================
export const RATING = {
  /** دریافت ریتینگ محصول */
  GET: REVIEWS.RATING,
  /** ارسال ریتینگ کاربر */
  SUBMIT: REVIEWS.RATING_SUBMIT,
  /** دریافت ریتینگ کاربر */
  USER: REVIEWS.USER_RATING,
  /** دریافت میانگین */
  AVERAGE: REVIEWS.AVERAGE,
  /** دریافت توزیع */
  DISTRIBUTION: REVIEWS.DISTRIBUTION,
}

// ============================================
// بخش جستجو (Search)
// ============================================
export const SEARCH = {
  /** جستجو در محصولات */
  PRODUCTS: '/wc/store/search/products',
  /** جستجو در نوشته‌ها */
  POSTS: '/wc/store/search/posts',
  /** جستجو در همه */
  ALL: '/wc/store/search',
  /** جستجوی پیشرفته */
  ADVANCED: '/wc/store/search/advanced',
  /** پیشنهادات جستجو */
  SUGGESTIONS: '/wc/store/search/suggestions',
}

// ============================================
// بخش فایل‌های رسانه‌ای (Media)
// ============================================
export const MEDIA = {
  /** دریافت لیست فایل‌ها */
  LIST: '/media',
  /** آپلود فایل */
  UPLOAD: '/media',
  /** دریافت فایل با شناسه */
  SINGLE: (id) => `/media/${id}`,
  /** حذف فایل */
  DELETE: (id) => `/media/${id}`,
  /** دریافت فایل‌های یک کاربر */
  BY_USER: (userId) => `/media?user=${userId}`,
}

// ============================================
// بخش منوها (Menus)
// ============================================
export const MENUS = {
  /** دریافت لیست منوها */
  LIST: '/wp/v2/menus',
  /** دریافت منو با شناسه */
  SINGLE: (id) => `/wp/v2/menus/${id}`,
  /** دریافت منو با اسلاگ */
  SLUG: (slug) => `/wp/v2/menus/slug/${slug}`,
  /** دریافت منوی اصلی */
  PRIMARY: '/wp/v2/menus/primary',
  /** دریافت منوی فوتر */
  FOOTER: '/wp/v2/menus/footer',
  /** دریافت منوی موبایل */
  MOBILE: '/wp/v2/menus/mobile',
}

// ============================================
// بخش بنرها (Banners)
// ============================================
// src/api/endpoints.js
export const BANNERS = {
  /** دریافت همه بنرها */
  ALL: '/hcms/v1/entries',
  
  /** بنرهای اسلایدر (collection_id: 2) */
  SLIDER: '/hcms/v1/entries?collection_id=2',
  /** بنرهای کوچک (collection_id: 3) */
  SMALL: '/hcms/v1/entries?collection_id=3',
  /** بنرهای تایمر (collection_id: 4) */
  TIMER: '/hcms/v1/entries?collection_id=4',
  /** بنرهای کلکسیون (collection_id: 5) */
  COLLECTION: '/hcms/v1/entries?collection_id=5',
  /** پیشنهاد ویژه هفته (collection_id: 6) */
  DEAL_OF_WEEK: '/hcms/v1/entries?collection_id=6',
  /** محبوب‌ترین محصولات (collection_id: 7) */
  POPULAR: '/hcms/v1/entries?collection_id=7',
  /** دریافت بنر با شناسه */
  SINGLE: (id) => `/hcms/v1/entries/${id}`,
}
// برای سازگاری با نسخه قبلی
export const DEALOFWEEK = BANNERS.DEAL_OF_WEEK

// ============================================
// بخش تنظیمات (Settings)
// ============================================
export const SETTINGS = {
  /** تنظیمات عمومی */
  GENERAL: '/wp/v2/settings',
  /** تنظیمات منو */
  MENU: '/wp/v2/settings/menu',
  /** تنظیمات فوتر */
  FOOTER: '/wp/v2/settings/footer',
  /** تنظیمات قالب */
  THEME: '/wp/v2/settings/theme',
  /** تنظیمات فروشگاه */
  STORE: '/wp/v2/settings/store',
  /** تنظیمات پرداخت */
  PAYMENT: '/wp/v2/settings/payment',
  /** تنظیمات ارسال */
  SHIPPING: '/wp/v2/settings/shipping',
}

// ============================================
// بخش تایمر (Timer)
// ============================================
export const TIMER = {
  /** تایمر صفحه اصلی */
  HOME: '/hcms/v1/entries?collection_id=6',
  /** تایمر پیشنهادات ویژه */
  SPECIAL: '/hcms/v1/entries?collection_id=7',
  /** تایمر فروش ویژه */
  FLASH_SALE: '/hcms/v1/entries?collection_id=8',
}

// ============================================
// بخش پرداخت (Checkout)
// ============================================
export const CHECKOUT = {
  /** دریافت اطلاعات پرداخت */
  GET: '/wc/store/checkout',
  /** پردازش سفارش */
  PROCESS: '/wc/store/checkout/process',
  /** تایید پرداخت */
  CONFIRM: '/wc/store/checkout/confirm',
  /** دریافت روش‌های پرداخت */
  PAYMENT_METHODS: '/wc/store/checkout/payment-methods',
  /** دریافت روش‌های ارسال */
  SHIPPING_METHODS: '/wc/store/checkout/shipping-methods',
}

// ============================================
// بخش تخفیف‌ها (Coupons)
// ============================================
export const COUPONS = {
  /** دریافت لیست کوپن‌ها */
  LIST: '/coupons',
  /** دریافت کوپن با شناسه */
  SINGLE: (id) => `/coupons/${id}`,
  /** اعتبارسنجی کوپن */
  VALIDATE: '/coupons/validate',
  /** دریافت کوپن‌های قابل استفاده */
  AVAILABLE: '/coupons/available',
}

// ============================================
// بخش اعلان‌ها (Notifications)
// ============================================
export const NOTIFICATIONS = {
  /** دریافت لیست اعلان‌ها */
  LIST: '/notifications',
  /** علامت‌گذاری به عنوان خوانده شده */
  MARK_READ: (id) => `/notifications/${id}/read`,
  /** علامت‌گذاری همه به عنوان خوانده شده */
  MARK_ALL_READ: '/notifications/read-all',
  /** حذف اعلان */
  DELETE: (id) => `/notifications/${id}`,
  /** تعداد اعلان‌های خوانده نشده */
  UNREAD_COUNT: '/notifications/unread-count',
}

// ============================================
// بخش تحلیل (Analytics)
// ============================================
export const ANALYTICS = {
  /** آمار فروش */
  SALES: '/analytics/sales',
  /** آمار بازدید */
  VISITS: '/analytics/visits',
  /** آمار محصولات */
  PRODUCTS: '/analytics/products',
  /** آمار کاربران */
  USERS: '/analytics/users',
  /** آمار سفارشات */
  ORDERS: '/analytics/orders',
}

// ============================================
// Helper functions برای ساخت URL
// ============================================
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, window.location.origin)
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key])
    }
  })
  return url.toString()
}

export const buildParams = (params = {}) => {
  const searchParams = new URLSearchParams()
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      searchParams.append(key, params[key])
    }
  })
  return searchParams.toString()
}

// ============================================
// Export همه endpoints
// ============================================
const endpoints = {
  AUTH,
  USERS,
  PAGES,
  POSTS,
  PRODUCTS,
  PRODUCT_CATEGORIES,
  BRANDS,
  CART,
  STORE,
  ORDERS,
  WISHLIST,
  REVIEWS,
  RATING,
  SEARCH,
  MEDIA,
  MENUS,
  BANNERS,
  SETTINGS,
  TIMER,
  CHECKOUT,
  COUPONS,
  NOTIFICATIONS,
  ANALYTICS,
  DEALOFWEEK,
  buildUrl,
  buildParams,
}

export default endpoints