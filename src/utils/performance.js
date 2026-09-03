// src/utils/performanceOptimizer.js

// ============================================
// 1. LCP Optimization
// ============================================
export const optimizeLCP = () => {
  if (typeof document === 'undefined') return;

  // پیدا کردن بزرگترین تصویر یا عنصر LCP
  const lcpElements = document.querySelectorAll('img, video, .lcp-element');
  
  lcpElements.forEach((el) => {
    // اضافه کردن fetchpriority="high" به LCP element
    if (el.tagName === 'IMG') {
      el.setAttribute('fetchpriority', 'high');
      el.setAttribute('loading', 'eager');
      
      // اگر تصویر LCP است، preload کن
      if (el.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = el.src;
        if (el.srcset) {
          link.imagesrcset = el.srcset;
        }
        document.head.appendChild(link);
      }
    }
  });
};

// ============================================
// 2. Render-Blocking Resources
// ============================================
export const deferRenderBlockingResources = () => {
  if (typeof document === 'undefined') return;

  // پیدا کردن تمام اسکریپت‌های blocking
  const scripts = document.querySelectorAll('script:not([async]):not([defer])');
  scripts.forEach((script) => {
    if (script.src && !script.src.includes('main.jsx')) {
      script.setAttribute('defer', '');
    }
  });

  // پیدا کردن تمام استایل‌های غیرضروری
  const styles = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
  styles.forEach((style) => {
    if (style.href && !style.href.includes('critical')) {
      style.setAttribute('media', 'print');
      style.onload = () => {
        style.removeAttribute('media');
      };
    }
  });
};

// ============================================
// 3. Image Optimization
// ============================================
export const optimizeImages = () => {
  if (typeof document === 'undefined') return;

  const images = document.querySelectorAll('img:not([data-optimized])');
  
  images.forEach((img) => {
    // اضافه کردن lazy loading برای تصاویر غیر LCP
    if (!img.hasAttribute('fetchpriority')) {
      img.setAttribute('loading', 'lazy');
    }

    // اضافه کردن decoding="async"
    img.setAttribute('decoding', 'async');

    // تبدیل به WebP اگر پشتیبانی شود
    if (img.src && !img.src.includes('.webp') && !img.src.includes('.svg')) {
      const supportsWebP = checkWebPSupport();
      if (supportsWebP) {
        const webpSrc = img.src.replace(/\.(jpg|jpeg|png|gif)/, '.webp');
        if (webpSrc !== img.src) {
          img.setAttribute('data-src-webp', webpSrc);
        }
      }
    }

    img.setAttribute('data-optimized', 'true');
  });
};

// ============================================
// 4. WebP Support Check
// ============================================
let webpSupportCache = null;

export const checkWebPSupport = () => {
  if (webpSupportCache !== null) return webpSupportCache;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(1, 1);
    const testWebP = canvas.toDataURL('image/webp');
    webpSupportCache = testWebP.includes('data:image/webp');
    return webpSupportCache;
  } catch {
    webpSupportCache = false;
    return false;
  }
};

// ============================================
// 5. Lazy Load Images with Intersection Observer
// ============================================
export const lazyLoadImagesObserver = () => {
  if (typeof window === 'undefined') return;
  
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[loading="lazy"], img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          if (img.dataset.srcWebp) {
            img.src = img.dataset.srcWebp;
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px',
    });
    
    images.forEach((img) => imageObserver.observe(img));
  }
};

// ============================================
// 6. Preconnect to Critical Origins
// ============================================
export const preconnectOrigins = () => {
  if (typeof document === 'undefined') return;

  const origins = [
    'https://api.honarmand.shop',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  origins.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// ============================================
// 7. Prefetch Next Pages
// ============================================
export const prefetchNextPages = (urls) => {
  if (typeof document === 'undefined' || !urls) return;

  urls.forEach((url) => {
    if (url) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    }
  });
};

// ============================================
// 8. Critical CSS Inlining
// ============================================
export const inlineCriticalCSS = () => {
  if (typeof document === 'undefined') return;

  const criticalStyles = `
    /* Critical CSS */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.6;
      min-height: 100vh;
    }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 1rem; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .min-h-screen { min-height: 100vh; }
    .gap-2 { gap: 0.5rem; }
    .gap-4 { gap: 1rem; }
    .bg-primary { background: #2563eb; }
    .text-primary { color: #2563eb; }
    .rounded-full { border-radius: 9999px; }
    .animate-bounce { animation: bounce 0.6s infinite; }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;

  const style = document.createElement('style');
  style.textContent = criticalStyles;
  style.id = 'critical-inline-css';
  document.head.insertBefore(style, document.head.firstChild);
};

// ============================================
// 9. Font Loading Optimization
// ============================================
export const optimizeFonts = () => {
  if (typeof document === 'undefined') return;

  // اضافه کردن font-display: swap به فونت‌ها
  const fonts = document.querySelectorAll('style:contains("font-face")');
  fonts.forEach((font) => {
    const content = font.textContent;
    if (content && !content.includes('font-display')) {
      font.textContent = content.replace(
        /@font-face/g,
        '@font-face { font-display: swap; '
      );
    }
  });
};

// ============================================
// 10. Reduce DOM Size
// ============================================
export const reduceDOMSize = () => {
  if (typeof document === 'undefined') return;

  // حذف عناصر غیرضروری
  const unnecessaryElements = document.querySelectorAll('.hidden, [aria-hidden="true"]:not(.essential)');
  unnecessaryElements.forEach((el) => {
    if (el.children.length === 0) {
      el.remove();
    }
  });
};

// ============================================
// 11. All Optimizations
// ============================================
export const runAllOptimizations = () => {
  if (typeof window === 'undefined') return;

  // اجرا با اولویت
  const tasks = [
    { fn: inlineCriticalCSS, priority: 1 },
    { fn: preconnectOrigins, priority: 2 },
    { fn: optimizeLCP, priority: 3 },
    { fn: deferRenderBlockingResources, priority: 4 },
    { fn: optimizeImages, priority: 5 },
    { fn: lazyLoadImagesObserver, priority: 6 },
    { fn: reduceDOMSize, priority: 7 },
  ];

  // اجرای همزمان با اولویت
  tasks.forEach((task) => {
    try {
      if (task.priority <= 3) {
        // اولویت بالا - اجرای فوری
        task.fn();
      } else if ('requestIdleCallback' in window) {
        // اولویت پایین - اجرا در زمان بیکاری
        requestIdleCallback(() => task.fn(), { timeout: 1000 });
      } else {
        setTimeout(task.fn, task.priority * 100);
      }
    } catch (error) {
      console.warn(`Optimization failed: ${task.fn.name}`, error);
    }
  });
};

// ============================================
// 12. Export all
// ============================================
export default {
  optimizeLCP,
  deferRenderBlockingResources,
  optimizeImages,
  checkWebPSupport,
  lazyLoadImagesObserver,
  preconnectOrigins,
  prefetchNextPages,
  inlineCriticalCSS,
  optimizeFonts,
  reduceDOMSize,
  runAllOptimizations,
};