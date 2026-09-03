// src/components/home/CollectionCards/CollectionCards.jsx
import React, { useState, useMemo, useCallback, memo } from 'react';
import { useGetCollectionBannersQuery } from '../../../../features/banners/bannersAPI';
import { Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import { OptimizedImage } from '../../../../components/ui/OptimizedImage/OptimizedImage';
import SectionHeader from '../SectionHeader/section-header';
import { extractImageUrl, extractTitle } from '../../../../utils/extractImage';

const DEFAULT_COLLECTIONS = [
  { id: 1, title: 'مجموعه ۱', image: '/images/default-collection.png' },
  { id: 2, title: 'مجموعه ۲', image: '/images/default-collection.png' },
  { id: 3, title: 'مجموعه ۳', image: '/images/default-collection.png' },
  { id: 4, title: 'مجموعه ۴', image: '/images/default-collection.png' },
];

const COLORS = [
  { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', overlay: 'from-purple-900/80 to-transparent' },
  { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', overlay: 'from-blue-900/80 to-transparent' },
  { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', overlay: 'from-green-900/80 to-transparent' },
  { bg: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30', overlay: 'from-orange-900/80 to-transparent' },
];

const CollectionSkeleton = () => (
  <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
    <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => <div key={i} className="aspect-square rounded-lg animate-pulse bg-muted" />)}
    </div>
  </section>
);

const CollectionCard = memo(({ collection, index }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const colorScheme = COLORS[index % COLORS.length];
  const imageUrl = useMemo(() => extractImageUrl(collection), [collection]);
  const title = useMemo(() => extractTitle(collection), [collection]);
  const slug = useMemo(() => collection.slug || collection.id || `collection-${index}`, [collection, index]);

  return (
    <div className={`group relative overflow-hidden rounded-lg transition-all duration-500 cursor-pointer ${isHovered ? 'shadow-2xl -translate-y-2' : 'shadow-lg'} bg-gradient-to-br ${colorScheme.bg} border ${colorScheme.border}`}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/collection/${slug}`}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {!imageError && imageUrl ? (
          <OptimizedImage src={imageUrl} alt={title} className={`h-full w-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 rotate-1' : 'scale-100'}`} loading="lazy" onError={() => setImageError(true)} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"><ShoppingBag className="h-12 w-12 text-gray-300" /></div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${colorScheme.overlay} transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
      </div>
      <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-5 transition-all duration-500 ${isHovered ? 'translate-y-0' : 'translate-y-1'}`}>
        <h3 className="text-sm md:text-base lg:text-lg font-bold text-white drop-shadow-lg line-clamp-1">{title}</h3>
        <div className={`mt-2 flex items-center gap-2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <button className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:bg-white/30 hover:scale-105">
            <span>مشاهده مجموعه</span> <ArrowLeft className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="absolute top-3 right-3 z-10 rounded-full bg-black/30 backdrop-blur-sm px-2.5 py-1">
        <span className="text-[10px] font-medium text-white/80">#{index + 1}</span>
      </div>
      <button className={`absolute bottom-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-500 ${isHovered ? 'scale-110 shadow-xl' : 'scale-100 shadow-md'} hover:bg-primary/90`}>
        <Plus className={`h-5 w-5 transition-transform duration-500 ${isHovered ? 'rotate-90' : 'rotate-0'}`} />
      </button>
    </div>
  );
});
CollectionCard.displayName = 'CollectionCard';

export function CollectionCards() {
  const { data: collectionsData, isLoading } = useGetCollectionBannersQuery();

  // ✅ استخراج آرایه از پاسخ API
  const collections = useMemo(() => {
    // اگر data وجود داشت و آرایه بود
    if (collectionsData?.data && Array.isArray(collectionsData.data)) {
      return collectionsData.data;
    }
    // اگر خود collectionsData آرایه بود
    if (Array.isArray(collectionsData)) {
      return collectionsData;
    }
    // اگر collectionsData یک آرایه داخل خودش داشت
    if (collectionsData?.items && Array.isArray(collectionsData.items)) {
      return collectionsData.items;
    }
    // اگر collectionsData یک آرایه داخل entries داشت
    if (collectionsData?.entries && Array.isArray(collectionsData.entries)) {
      return collectionsData.entries;
    }
    // در غیر این صورت آرایه خالی
    return [];
  }, [collectionsData]);

  const processedCollections = useMemo(() => {
    if (!collections || collections.length === 0) {
      return DEFAULT_COLLECTIONS;
    }
    return collections.slice(0, 4);
  }, [collections]);

  if (isLoading) return <CollectionSkeleton />;
  if (!processedCollections || processedCollections.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <SectionHeader title="مجموعه‌ها" subtitle="جدیدترین و محبوب‌ترین مجموعه‌های ما" href="/مجموعه-ها" />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {processedCollections.map((collection, index) => (
          <CollectionCard key={collection.id || index} collection={collection} index={index} />
        ))}
      </div>
    </section>
  );
}

export default React.memo(CollectionCards);