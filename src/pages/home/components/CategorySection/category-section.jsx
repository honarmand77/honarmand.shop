// src/components/home/CategorySection/CategorySection.jsx
import { useRef, useState, useEffect, useCallback, memo, useMemo } from "react";
import { useGetCategoriesQuery } from '../../../../features/categories/categoriesAPI';
import { CategoryCard } from "../CategoryCard/category-card";
import { SectionHeader } from "../SectionHeader/section-header";

export const CategorySection = memo(() => {
  const { data: categoriesData, isLoading } = useGetCategoriesQuery({ perPage: 20 });
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ✅ اصلاح: استخراج دسته‌بندی‌ها از پاسخ API
  const categories = useMemo(() => {
    if (!categoriesData) return [];
    if (Array.isArray(categoriesData)) return categoriesData;
    if (categoriesData?.data && Array.isArray(categoriesData.data)) return categoriesData.data;
    if (categoriesData?.categories && Array.isArray(categoriesData.categories)) return categoriesData.categories;
    return [];
  }, [categoriesData]);

  const updateButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  const scroll = useCallback((direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: direction * container.clientWidth * 0.9, behavior: "smooth" });
  }, []);

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

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <SectionHeader title="دسته‌بندی ها" showArrows={true} />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(15)].map((_, i) => <div key={i} className="h-[140px] w-[180px] shrink-0 animate-pulse rounded-xl bg-muted" />)}
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 md:px-6 min-h-[180px] md:min-h-[200px] animate-fadeInUp">
      <SectionHeader title="دسته‌بندی ها" subtitle="جستجو بر اساس دسته بندی" showArrows={true}
        onPrevClick={() => scroll(-1)} onNextClick={() => scroll(1)}
        prevDisabled={!canScrollLeft} nextDisabled={!canScrollRight}
      />
      <div ref={scrollContainerRef} className="category-scroll-container" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', overflowY: 'hidden', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', scrollPadding: '0 1rem' }}>
        {categories.map((category) => (
          <div key={category.id} className="shrink-0 snap-start w-[150px] sm:w-[150px] md:w-[170px] lg:w-[190px] xl:w-[200px]">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  );
});

CategorySection.displayName = 'CategorySection';
export default CategorySection;