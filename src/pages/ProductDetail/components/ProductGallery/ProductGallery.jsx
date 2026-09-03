// src/pages/product/components/ProductGallery.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { OptimizedImage } from '../../../../components/ui/OptimizedImage/OptimizedImage';

const ProductGallery = ({ images, selectedImage, onImageSelect, productName }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  // اگر تصویری وجود نداشت
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 md:h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <span className="text-gray-400">تصویری موجود نیست</span>
      </div>
    );
  }

  const mainImage = images[selectedImage] || images[0];

  const handlePrevImage = () => {
    onImageSelect((selectedImage - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    onImageSelect((selectedImage + 1) % images.length);
  };

  const handleZoom = (index) => {
    setZoomIndex(index);
    setIsZoomed(true);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 aspect-square">
          <OptimizedImage
            src={mainImage}
            alt={productName || 'تصویر محصول'}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="eager"
          />
          
          {/* Zoom Button */}
          <button
            onClick={() => handleZoom(selectedImage)}
            className="absolute bottom-3 right-3 p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-200 opacity-50 group-hover:opacity-100"
            aria-label="بزرگنمایی"
          >
            <ZoomIn className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="تصویر قبلی"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="تصویر بعدی"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                selectedImage === index
                  ? 'border-primary shadow-md'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <OptimizedImage
                src={image}
                alt={`تصویر ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                width={80}
                height={80}
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="بستن"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-4xl max-h-[90vh]">
            <OptimizedImage
              src={images[zoomIndex] || images[0]}
              alt={productName || 'تصویر محصول'}
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
          
          {/* Zoom Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    zoomIndex === index
                      ? 'w-6 bg-white'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProductGallery;