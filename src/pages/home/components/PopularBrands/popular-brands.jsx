// src/components/home/PopularBrands/PopularBrands.jsx
import { useRef, useState, useEffect, useCallback, memo, useMemo } from "react";
import { useGetBrandsQuery } from '../../../../features/brands/brandsAPI';
import { SectionHeader } from "../SectionHeader/section-header";
import { OptimizedImage } from '../../../../components/ui/OptimizedImage/OptimizedImage';

export const PopularBrands = memo(() => {
  // ✅ دریافت برندها از API
  const { data: brandsData, isLoading } = useGetBrandsQuery({ perPage: 50 });
  
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ✅ استخراج برندها از پاسخ API
  const brands = useMemo(() => {
    if (!brandsData) return [];
    if (Array.isArray(brandsData)) return brandsData;
    if (brandsData?.data && Array.isArray(brandsData.data)) return brandsData.data;
    if (brandsData?.items && Array.isArray(brandsData.items)) return brandsData.items;
    if (brandsData?.entries && Array.isArray(brandsData.entries)) return brandsData.entries;
    return [];
  }, [brandsData]);

  // ✅ بررسی وضعیت دکمه‌ها
  const updateButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  // ✅ اسکرول
  const scroll = useCallback((direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * container.clientWidth * 0.9,
      behavior: "smooth",
    });
  }, []);

  const scrollLeft = useCallback(() => scroll(-1), [scroll]);
  const scrollRight = useCallback(() => scroll(1), [scroll]);

  // ✅ Event Listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const timeoutId = setTimeout(updateButtons, 100);
    container.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  // ✅ Loading
  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <SectionHeader title="برندهای محبوب" showArrows={true} />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 w-[180px] shrink-0 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </section>
    );
  }

  // ✅ اگر برندی وجود نداشت
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 min-h-[200px] md:min-h-[200px] lg:min-h-[220px] animate-fadeInUp">
      <SectionHeader
        title="برندهای محبوب"
        subtitle="برترین برند های غذایی"
        showArrows={true}
        onPrevClick={scrollLeft}
        onNextClick={scrollRight}
        prevDisabled={!canScrollLeft}
        nextDisabled={!canScrollRight}
      />

      <div
        ref={scrollContainerRef}
        className="brands-scroll-container"
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
          scrollPadding: '0 1rem',
        }}
      >
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="shrink-0 snap-start w-[120px] sm:w-[130px] md:w-[140px] lg:w-[160px] xl:w-[180px]"
          >
            <div className="relative flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-2 transition-all hover:shadow-lg hover:scale-105 hover:border-primary cursor-pointer group">
              {/* لوگو برند */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden transition-all group-hover:bg-primary/20 group-hover:scale-110">
                {brand.image ? (
                  <OptimizedImage 
                    src={brand.image} 
                    alt={brand.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {brand.name?.charAt(0).toUpperCase() || 'B'}
                  </span>
                )}
              </div>

              {/* نام برند */}
              <span className="text-sm font-semibold text-foreground text-center line-clamp-2">
                {brand.name}
              </span>

              {/* تعداد محصولات */}
              {brand.count && (
                <span className="text-xs text-muted-foreground">
                  {brand.count.toLocaleString('fa-IR')} محصول
                </span>
              )}

              {/* نشان ویژه */}
              {brand.featured && (
                <span className="absolute top-2 right-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  ویژه
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

PopularBrands.displayName = 'PopularBrands';

export default PopularBrands;