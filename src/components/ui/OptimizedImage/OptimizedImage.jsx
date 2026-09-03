// src/components/ui/OptimizedImage/OptimizedImage.jsx
import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import FallbackImage from '../../../assets/images/FallbackImage.png';

// ============================================
// 1. WebP Support Check (Cached)
// ============================================
let webpSupportCache = null;

const checkWebPSupport = () => {
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
// 2. Optimized Image Component
// ============================================
export const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  quality = 80,
  placeholder = null,
  isLCP = false,
  priority = false,
  blurDataURL = null,
  objectFit = 'cover',
  sizes: propSizes = null,
  onLoad: onLoadProp,
  onError: onErrorProp,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const loadTimeoutRef = useRef(null);

  const supportsWebP = useMemo(() => checkWebPSupport(), []);

  // ============================================
  // 3. Optimized URL with better caching
  // ============================================
  const finalSrc = useMemo(() => {
    if (error || !src) return placeholder || FallbackImage;

    // Skip optimization for SVGs, GIFs, and data URLs
    if (
      src.includes('.svg') ||
      src.includes('.gif') ||
      src.startsWith('data:') ||
      src.startsWith('blob:')
    ) {
      return src;
    }

    // Skip if already optimized
    if (src.includes('format=webp') || src.includes('fm=webp')) {
      return src;
    }

    const separator = src.includes('?') ? '&' : '?';
    let optimizedUrl = src;

    // Add WebP (if supported)
    if (supportsWebP && !src.includes('.webp')) {
      optimizedUrl = `${optimizedUrl}${separator}fm=webp`;
    }

    // Add quality (if not present)
    if (!optimizedUrl.includes('q=') && !optimizedUrl.includes('quality=')) {
      const sep = optimizedUrl.includes('?') ? '&' : '?';
      optimizedUrl = `${optimizedUrl}${sep}q=${quality}`;
    }

    return optimizedUrl;
  }, [src, supportsWebP, error, quality, placeholder]);

  // ============================================
  // 4. Responsive Sizes with better defaults
  // ============================================
  const sizes = useMemo(() => {
    if (propSizes) return propSizes;
    if (width && height) {
      return `(max-width: ${width}px) 100vw, ${width}px`;
    }
    // Better default sizes for responsive images
    return isLCP 
      ? '100vw' 
      : '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
  }, [width, height, isLCP, propSizes]);

  // ============================================
  // 5. srcSet Generation with better quality
  // ============================================
  const srcSet = useMemo(() => {
    if (!finalSrc || error || finalSrc.includes('.svg') || finalSrc.includes('.gif')) {
      return undefined;
    }

    const baseUrl = finalSrc.split('?')[0];
    const queryParams = finalSrc.includes('?') ? finalSrc.split('?')[1] : '';

    // For LCP images, more sizes with better quality
    if (isLCP || priority) {
      const sizes = [320, 480, 640, 768, 1024, 1280, 1536, 1920];
      return sizes
        .map(size => `${baseUrl}?${queryParams}&w=${size} ${size}w`)
        .join(', ');
    }

    // For non-critical images, fewer sizes
    return `${baseUrl}?${queryParams}&w=320 320w, ${baseUrl}?${queryParams}&w=640 640w, ${baseUrl}?${queryParams}&w=1024 1024w`;
  }, [finalSrc, isLCP, priority, error]);

  // ============================================
  // 6. Intersection Observer with better config
  // ============================================
  useEffect(() => {
    if (isLCP || priority || loading === 'eager') {
      setIsIntersecting(true);
      return;
    }

    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsIntersecting(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '300px 0px', // Increased for better performance
        threshold: 0.01,
      }
    );

    observerRef.current.observe(container);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isLCP, priority, loading]);

  // ============================================
  // 7. Load Handlers with better error handling
  // ============================================
  const handleLoad = useCallback((e) => {
    setIsLoaded(true);
    // Clear timeout if exists
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    if (onLoadProp) onLoadProp(e);
  }, [onLoadProp]);

  const handleError = useCallback((e) => {
    setError(true);
    setIsLoaded(false);
    if (onErrorProp) onErrorProp(e);
    // فقط در محیط توسعه لاگ کن
    if (process.env.NODE_ENV === 'development') {
      console.warn('Image failed to load:', src);
    }
  }, [src, onErrorProp]);

  // ============================================
  // 8. Prevent layout shift with fixed dimensions
  // ============================================
  const aspectRatio = useMemo(() => {
    if (width && height) return `${width}/${height}`;
    return undefined;
  }, [width, height]);

  // ============================================
  // 9. Render with proper ARIA attributes
  // ============================================
  const shouldLoad = isIntersecting || isLCP || priority;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width || '100%',
        height: height || 'auto',
        aspectRatio,
      }}
      role="img"
      aria-label={alt || 'تصویر'}
    >
      {/* Skeleton with reduced animation for performance */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />
      )}

      {/* Main Image with proper loading attributes */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={finalSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt || 'تصویر'}
          width={width}
          height={height}
          loading={isLCP || priority ? 'eager' : loading}
          fetchPriority={isLCP || priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full transition-opacity duration-300 ease-out
            ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${error ? 'hidden' : 'block'}
          `}
          {...props}
        />
      )}

      {/* Error Fallback with proper accessibility */}
      {error && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          role="img"
          aria-label="تصویر در دسترس نیست"
        >
          {placeholder ? (
            <img
              src={placeholder}
              alt={alt || 'تصویر جایگزین'}
              className="w-full h-full object-contain max-h-[200px] opacity-50"
              loading="lazy"
            />
          ) : (
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// ============================================
// 10. Helper Components with better naming
// ============================================

/** 📸 LCP Image (Largest Contentful Paint) */
export const LCPImage = memo((props) => (
  <OptimizedImage {...props} isLCP={true} loading="eager" priority={true} />
));
LCPImage.displayName = 'LCPImage';

/** 📸 Fixed Size Image */
export const FixedImage = memo(({ width, height, ...props }) => (
  <OptimizedImage {...props} width={width} height={height} />
));
FixedImage.displayName = 'FixedImage';

/** 📸 Responsive Image with srcSet */
export const ResponsiveImage = memo(({ src, sizes: customSizes, ...props }) => (
  <OptimizedImage {...props} src={src} sizes={customSizes} />
));
ResponsiveImage.displayName = 'ResponsiveImage';

/** 📸 Background Image with better performance */
export const BackgroundImage = memo(({ src, children, className, loading = 'lazy', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      {...props}
    >
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse" />
      )}
      {children}
    </div>
  );
});
BackgroundImage.displayName = 'BackgroundImage';

// ============================================
// 11. Default Export
// ============================================
export default OptimizedImage;