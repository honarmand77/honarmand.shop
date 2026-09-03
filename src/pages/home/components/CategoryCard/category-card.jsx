// src/components/home/CategoryCard/category-card.jsx
import { useMemo } from "react";
import { OptimizedImage } from "../../../../components/ui/OptimizedImage/OptimizedImage";
import { extractImageUrl, isValidImageUrl } from "../../../../utils/extractImage";

export function CategoryCard({ category }) {
  // ✅ استخراج تصویر با استفاده از extractImageUrl
  const imageUrl = useMemo(() => {
    const image = extractImageUrl(category);
    return image && isValidImageUrl(image) ? image : null;
  }, [category]);

  const categoryName = useMemo(() => {
    return category?.name || category?.title || 'دسته‌بندی';
  }, [category]);


  return (
    <a
      href={`/دسته-بندی/${categoryName}`}
      className="group flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-2 transition-shadow hover:shadow-md"
    >
      <div className="overflow-hidden flex h-[100px] w-[100px] lg:h-[120px] lg:w-[120px] items-center justify-center rounded-full bg-muted/50 transition-transform group-hover:scale-105">
        <OptimizedImage
          src={imageUrl}
          alt={categoryName}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="w-full rounded-md border border-border p-1 text-center text-sm font-medium hover:bg-primary hover:text-primary-foreground">
        مشاهده
      </span>
    </a>
  );
}