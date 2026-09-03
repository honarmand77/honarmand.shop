import React from 'react';
import { Link } from 'react-router-dom';
import ProductPreview from '../ProductPreview/ProductPreview';

const CollectionCard = ({ collection }) => {
  const {
    id,
    slug,
    name,
    description,
    coverImage,
    productCount,
    previewProducts,
    count,
    image,
  } = collection;

  // استفاده از تصویر مناسب
  const imageUrl = coverImage || image?.src || image || '/images/placeholder-collection.jpg';
  const productCountDisplay = productCount || count || 0;

  return (
    <Link
      to={`/category/${slug || id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
    >
      {/* بخش تصویر */}
      <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={name || 'مجموعه'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/placeholder-collection.jpg';
          }}
        />
        
        {/* Overlay پایین */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
          <span className="inline-block bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
            {productCountDisplay} محصول
          </span>
        </div>
      </div>

      {/* محتوای کارت */}
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 line-clamp-1">
          {name || 'بدون نام'}
        </h3>
        
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* پیش‌نمایش محصولات */}
        {previewProducts?.length > 0 && (
          <ProductPreview products={previewProducts} total={productCountDisplay} />
        )}

        {/* دکمه مشاهده */}
        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <span className="inline-flex items-center gap-1.5 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
            مشاهده مجموعه
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;