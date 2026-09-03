import React from 'react';

const ProductPreview = ({ products, total }) => {
  const showCount = Math.min(products.length, 3);
  const remaining = total - showCount;

  // تابع برای گرفتن تصویر محصول
  const getProductImage = (product) => {
    if (product.images?.[0]?.src) return product.images[0].src;
    if (product.image?.src) return product.image.src;
    if (product.images?.[0]) return product.images[0];
    return '/images/placeholder.jpg';
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      {products.slice(0, 3).map((product, index) => (
        <div
          key={index}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border-2 border-gray-100 flex-shrink-0 bg-gray-50"
        >
          <img
            src={getProductImage(product)}
            alt={product.name || 'محصول'}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
            }}
          />
        </div>
      ))}
      
      {remaining > 0 && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default ProductPreview;