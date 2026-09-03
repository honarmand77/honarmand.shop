// src/utils/extractImage.js - نسخه نهایی و کامل

/**
 * استخراج URL تصویر از بنر با فرمت‌های مختلف
 * پشتیبانی از تمام ساختارهای داده ممکن
 */
export const extractImageUrl = (banner) => {
  if (!banner) return null;

  // لاگ برای دیباگ (در محیط production غیرفعال می‌شود)
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.log('📸 extractImageUrl - banner keys:', Object.keys(banner));
  }

  // ============================================
  // ۱. بررسی فیلدهای اصلی تصویر
  // ============================================
  
  // featured_image
  if (banner.featured_image) {
    if (typeof banner.featured_image === 'string' && banner.featured_image.trim()) {
      return banner.featured_image.trim();
    }
    if (typeof banner.featured_image === 'object' && banner.featured_image !== null) {
      const url = banner.featured_image.url || banner.featured_image.src || banner.featured_image.path || '';
      if (url && url.trim()) return url.trim();
    }
  }

  // image
  if (banner.image) {
    if (typeof banner.image === 'string' && banner.image.trim()) {
      return banner.image.trim();
    }
    if (typeof banner.image === 'object' && banner.image !== null) {
      const url = banner.image.url || banner.image.src || banner.image.path || '';
      if (url && url.trim()) return url.trim();
    }
  }

  // imageUrl / image_url
  if (banner.imageUrl || banner.image_url) {
    const img = banner.imageUrl || banner.image_url;
    if (typeof img === 'string' && img.trim()) {
      return img.trim();
    }
    if (typeof img === 'object' && img !== null) {
      const url = img.url || img.src || img.path || '';
      if (url && url.trim()) return url.trim();
    }
  }

  // img
  if (banner.img) {
    if (typeof banner.img === 'string' && banner.img.trim()) {
      return banner.img.trim();
    }
    if (typeof banner.img === 'object' && banner.img !== null) {
      const url = banner.img.url || banner.img.src || banner.img.path || '';
      if (url && url.trim()) return url.trim();
    }
  }

  // thumbnail / thumb
  if (banner.thumbnail || banner.thumb) {
    const thumb = banner.thumbnail || banner.thumb;
    if (typeof thumb === 'string' && thumb.trim()) {
      return thumb.trim();
    }
    if (typeof thumb === 'object' && thumb !== null) {
      const url = thumb.url || thumb.src || thumb.path || '';
      if (url && url.trim()) return url.trim();
    }
  }

  // cover / picture / photo
  if (banner.cover || banner.picture || banner.photo) {
    const media = banner.cover || banner.picture || banner.photo;
    if (typeof media === 'string' && media.trim()) {
      return media.trim();
    }
    if (typeof media === 'object' && media !== null) {
      const url = media.url || media.src || media.path || '';
      if (url && url.trim()) return url.trim();
    }
  }

  // ============================================
  // ۲. بررسی فیلدهای آرایه‌ای
  // ============================================
  
  // images (آرایه)
  if (banner.images && Array.isArray(banner.images) && banner.images.length > 0) {
    const firstImage = banner.images[0];
    if (typeof firstImage === 'string' && firstImage.trim()) {
      return firstImage.trim();
    }
    if (typeof firstImage === 'object' && firstImage !== null) {
      const url = firstImage.url || firstImage.src || firstImage.path || '';
      if (url && url.trim()) return url.trim();
    }
  }

  // gallery_images (آرایه)
  if (banner.gallery_images) {
    try {
      let images = banner.gallery_images;
      if (typeof images === 'string') {
        images = JSON.parse(images);
      }
      if (Array.isArray(images) && images.length > 0) {
        const firstImage = images[0];
        if (typeof firstImage === 'string' && firstImage.trim()) {
          return firstImage.trim();
        }
        if (typeof firstImage === 'object' && firstImage !== null) {
          const url = firstImage.url || firstImage.src || firstImage.path || '';
          if (url && url.trim()) return url.trim();
        }
      }
    } catch {
      // خطا رو نادیده بگیر
    }
  }

  // media (آرایه)
  if (banner.media && Array.isArray(banner.media) && banner.media.length > 0) {
    const firstMedia = banner.media[0];
    if (typeof firstMedia === 'string' && firstMedia.trim()) {
      return firstMedia.trim();
    }
    if (typeof firstMedia === 'object' && firstMedia !== null) {
      const url = firstMedia.url || firstMedia.src || firstMedia.path || '';
      if (url && url.trim()) return url.trim();
    }
  }

  // ============================================
  // ۳. استخراج از محتوای HTML
  // ============================================
  
  // content
  if (banner.content && typeof banner.content === 'string') {
    // استخراج از تگ img
    const imgMatch = banner.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1].trim();
    }
    
    // استخراج از background-image
    const bgMatch = banner.content.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
    if (bgMatch && bgMatch[1]) {
      return bgMatch[1].trim();
    }
  }

  // description / body
  if (banner.description || banner.body || banner.text) {
    const text = banner.description || banner.body || banner.text;
    if (typeof text === 'string') {
      const imgMatch = text.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        return imgMatch[1].trim();
      }
    }
  }

  // ============================================
  // ۴. بررسی فیلدهای لینک که ممکن است تصویر باشند
  // ============================================
  
  // url (اگر با فرمت تصویر باشد)
  if (banner.url && typeof banner.url === 'string' && banner.url.trim()) {
    const url = banner.url.trim();
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)(\?.*)?$/i) ||
        url.startsWith('data:image/')) {
      return url;
    }
  }

  // src
  if (banner.src && typeof banner.src === 'string' && banner.src.trim()) {
    const src = banner.src.trim();
    if (src.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)(\?.*)?$/i) ||
        src.startsWith('data:image/')) {
      return src;
    }
  }

  // ============================================
  // ۵. جستجوی عمیق در کل آبجکت
  // ============================================
  
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)(\?.*)?$/i;
  const dataImagePattern = /^data:image\//i;
  
  const deepSearch = (obj, depth = 0) => {
    if (depth > 3 || !obj || typeof obj !== 'object') return null;
    
    const keys = Object.keys(obj);
    for (const key of keys) {
      const value = obj[key];
      
      if (typeof value === 'string' && value.trim()) {
        const trimmed = value.trim();
        if (imageExtensions.test(trimmed) || dataImagePattern.test(trimmed)) {
          return trimmed;
        }
      }
      
      if (Array.isArray(value) && value.length > 0) {
        for (const item of value) {
          if (typeof item === 'string' && item.trim()) {
            const trimmed = item.trim();
            if (imageExtensions.test(trimmed) || dataImagePattern.test(trimmed)) {
              return trimmed;
            }
          }
          if (typeof item === 'object' && item !== null) {
            const result = deepSearch(item, depth + 1);
            if (result) return result;
          }
        }
      }
      
      if (typeof value === 'object' && value !== null) {
        const result = deepSearch(value, depth + 1);
        if (result) return result;
      }
    }
    
    return null;
  };

  const deepResult = deepSearch(banner);
  if (deepResult) return deepResult;

  // ============================================
  // ۶. اگر هیچ تصویری پیدا نشد
  // ============================================
  
  if (isDev) {
    console.warn('❌ No image found in banner:', banner);
  }
  
  return null;
};

/**
 * استخراج همه تصاویر از بنر (برای گالری)
 */
export const extractAllImages = (banner) => {
  if (!banner) return [];

  const images = [];
  const imageSet = new Set();

  const addImage = (url) => {
    if (url && typeof url === 'string' && url.trim()) {
      const trimmed = url.trim();
      if (!imageSet.has(trimmed)) {
        imageSet.add(trimmed);
        images.push(trimmed);
      }
    }
  };

  // بررسی فیلدهای مختلف
  const fieldsToCheck = [
    'featured_image',
    'image',
    'imageUrl',
    'image_url',
    'img',
    'thumbnail',
    'thumb',
    'cover',
    'picture',
    'photo',
    'url',
    'src',
    'gallery_images',
    'images',
    'media'
  ];

  for (const field of fieldsToCheck) {
    const value = banner[field];
    if (!value) continue;

    if (typeof value === 'string') {
      addImage(value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') {
          addImage(item);
        } else if (typeof item === 'object' && item !== null) {
          addImage(item.url || item.src || item.path || '');
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      addImage(value.url || value.src || value.path || '');
    }
  }

  // استخراج از محتوای HTML
  if (banner.content && typeof banner.content === 'string') {
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(banner.content)) !== null) {
      if (match[1]) addImage(match[1]);
    }
  }

  return images;
};

/**
 * استخراج متن از content (حذف تگ‌های HTML)
 */
export const extractTextFromContent = (content) => {
  if (!content) return '';
  if (typeof content !== 'string') content = String(content);
  
  // حذف تگ‌های HTML
  let text = content.replace(/<[^>]*>/g, ' ');
  // حذف فاصله‌های اضافی
  text = text.replace(/\s+/g, ' ').trim();
  return text;
};

/**
 * استخراج عنوان از بنر
 */
export const extractTitle = (banner) => {
  if (!banner) return 'بنر';
  
  // فیلدهای مختلف عنوان
  const title = banner.title || 
                banner.name || 
                banner.label || 
                banner.heading || 
                banner.subject || 
                banner.header || 
                'بنر';
  
  if (typeof title === 'string') {
    // حذف تگ‌های HTML
    return title.replace(/<[^>]+>/g, '').trim() || 'بنر';
  }
  
  return 'بنر';
};

/**
 * استخراج دکمه از بنر
 */
export const extractButton = (banner) => {
  if (!banner) return { text: 'مشاهده', link: '/store' };
  
  // استخراج متن دکمه
  const text = banner.buttonText || 
               banner.button_text || 
               banner.cta || 
               banner.ctaText || 
               banner.cta_text || 
               banner.link_text || 
               banner.linkText || 
               'مشاهده';
  
  // استخراج لینک دکمه
  const link = banner.buttonLink || 
               banner.button_link || 
               banner.link || 
               banner.slug || 
               banner.url || 
               banner.href || 
               '/store';
  
  return {
    text: typeof text === 'string' ? text.replace(/<[^>]+>/g, '').trim() : 'مشاهده',
    link: typeof link === 'string' ? link.trim() : '/store'
  };
};

/**
 * بررسی معتبر بودن URL تصویر
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  
  const validExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)(\?.*)?$/i;
  const validDataUrl = /^data:image\/(png|jpeg|jpg|gif|webp|svg|bmp);base64,/i;
  const validUrl = /^https?:\/\/.+/i;
  
  return validUrl.test(trimmed) || 
         trimmed.startsWith('/') || 
         validDataUrl.test(trimmed) || 
         validExtensions.test(trimmed);
};

/**
 * نرمال‌سازی URL تصویر
 */
export const normalizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  let normalized = url.trim();
  
  // اگر با // شروع شده، https:// اضافه کن
  if (normalized.startsWith('//')) {
    normalized = `https:${normalized}`;
  }
  
  // اگر با / شروع شده و دامنه ندارد
  if (normalized.startsWith('/') && !normalized.startsWith('//')) {
    // در محیط توسعه، از localhost استفاده کن
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:3000${normalized}`;
    }
  }
  
  return normalized;
};