// src/components/home/PromoBanners/PromoBanners.jsx
import { useState, useMemo, useCallback, memo } from 'react';
import { useGetSmallBannersQuery } from '../../../../features/banners/bannersAPI';
import { ArrowLeft } from "lucide-react";
import { OptimizedImage } from '../../../../components/ui/OptimizedImage/OptimizedImage';
import SectionHeader from '../SectionHeader/section-header';
import { extractImageUrl, extractTitle } from '../../../../utils/extractImage';

const PromoSkeleton = () => (
  <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 min-h-[150px] md:min-h-[250px] lg:min-h-[300px]">
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {[...Array(2)].map((_, i) => <div key={i} className="h-48 rounded-lg animate-pulse bg-muted" />)}
    </div>
  </section>
);

const PromoBanner = memo(({ banner, index }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = useMemo(() => extractImageUrl(banner), [banner]);
  const title = useMemo(() => extractTitle(banner), [banner]);
  const link = useMemo(() => banner.link || banner.slug || `/post/${banner.id || index}`, [banner, index]);
  const buttonLabel = useMemo(() => ['سفارش دهید', 'مشاهده و خرید', 'ثبت سفارش', 'خرید کنید'][index % 4], [index]);

  return (
    <a href={link} className="group relative block h-full min-h-[100px] md:min-h-[150px] lg:min-h-[200px] overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1" aria-label={title}>
      <div className="absolute top-3 left-3 z-20 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">تخفیف</div>
      <div>
        {!imageError && imageUrl ? (
          <OptimizedImage src={imageUrl} alt={title} className="w-full h-full object-cover transition-all duration-700 hover:scale-105 rounded-lg shadow-2xl animate-fadeInUp" loading="lazy" onError={() => setImageError(true)} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-gray-300">🛍️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white drop-shadow-lg">{title}</span>
          <span className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white transition-all group-hover:bg-white/30">{buttonLabel} <ArrowLeft className="h-3 w-3" /></span>
        </div>
      </div>
    </a>
  );
});
PromoBanner.displayName = 'PromoBanner';

export const PromoBanners = memo(() => {
  // ✅ دریافت داده از API
  const { data, isLoading } = useGetSmallBannersQuery();

  // ✅ تبدیل data به آرایه با fallback
  const banners = useMemo(() => {
    // اگر data آرایه بود، ازش استفاده کن
    if (Array.isArray(data)) return data;
    // اگر data وجود داشت ولی آرایه نبود
    if (data && !Array.isArray(data)) {
      console.warn('⚠️ Promo banners data is not an array:', data);
      return [];
    }
    // اگر data undefined یا null بود
    return [];
  }, [data]);

  const promoBanners = useMemo(() => {
    if (!banners || banners.length === 0) return [];
    return banners.slice(0, 4);
  }, [banners]);

  if (isLoading) return <PromoSkeleton />;
  if (promoBanners.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <SectionHeader title="مجموعه‌های ویژه" subtitle="محبوب‌ترین مجموعه‌های ما" href="/مجموعه-ها" />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {promoBanners.map((banner, index) => <PromoBanner key={banner.id || index} banner={banner} index={index} />)}
      </div>
    </section>
  );
});

PromoBanners.displayName = 'PromoBanners';
export default PromoBanners;