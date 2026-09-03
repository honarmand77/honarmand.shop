// components/ProductDetail/components/ProductInfo/ProductInfo.jsx
import { ShoppingCart, Heart, Share2, CheckCircle, AlertCircle, Star, Shield, Truck, RotateCcw, Zap } from 'lucide-react';
import Toman from '../../../../assets/icons/toman';

const ProductInfo = ({ 
  product, 
  quantity, 
  onQuantityChange, 
  onAddToCart,
  isAddingToCart,
  isInStock,
  stockText 
}) => {
  // قیمت‌ها
  const price = product.prices?.price || product.price || 0;
  const regularPrice = product.prices?.regular_price || product.regular_price || 0;
  const isOnSale = product.on_sale || (regularPrice > price);
  const discountPercent = isOnSale && regularPrice > 0 
    ? Math.round(((regularPrice - price) / regularPrice) * 100)
    : 0;

  const formattedPrice = Number(price).toLocaleString('fa-IR');
  const formattedRegularPrice = Number(regularPrice).toLocaleString('fa-IR');

  // ریتینگ
  const averageRating = product.averageRating || product.average_rating || 0;
  const reviewCount = product.reviewCount || product.review_count || 0;

  // تبدیل ریتینگ به ستاره
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={16} className="fill-yellow-400 text-yellow-400 drop-shadow-sm" />
        ))}
        {hasHalfStar && (
          <Star size={16} className="fill-yellow-400 text-yellow-400 drop-shadow-sm" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} className="text-gray-200" />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-5 md:gap-6 animate-fadeIn">
      
      {/* --- Header: Name + Action Buttons --- */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight flex-1">
          {product.name}
        </h1>
        <div className="flex gap-2 shrink-0">
          <button 
            className="group p-2.5 backdrop-blur-sm rounded-full hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 hover:text-red-500 hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300 border border-gray-100/50"
            aria-label="افزودن به علاقه‌مندی‌ها"
          >
            <Heart size={20} className="group-hover:scale-110 transition-transform duration-300" />
          </button>
          <button 
            className="group p-2.5 backdrop-blur-sm rounded-full hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-500 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 border border-gray-100/50"
            aria-label="اشتراک‌گذاری"
          >
            <Share2 size={20} className="group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* --- Rating & Brand --- */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 bg-gradient-to-br from-yellow-50/80 to-amber-50/80 px-3.5 py-1.5 rounded-full border border-yellow-200/50 backdrop-blur-sm shadow-sm">
            <div className="flex items-center">
              {renderStars(averageRating)}
            </div>
            <span className="font-bold text-sm">{averageRating.toFixed(1)}</span>
            <span className=" text-xs">({reviewCount} نظر)</span>
          </div>
        )}
        {product.brand && (
          <>
            <span className=" hidden sm:inline">•</span>
            <span className=" text-sm">
              برند: <span className="font-semibold hover:text-red-500 transition-colors cursor-pointer">{product.brand}</span>
            </span>
          </>
        )}
      </div>

      {/* --- Stock Status & SKU --- */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          {isInStock ? (
            <span className="flex items-center gap-1.5 text-emerald-600  px-3.5 py-1.5 rounded-full border border-emerald-200/50 shadow-sm">
              <CheckCircle size={16} className="text-emerald-500" />
              <span className="font-medium">{stockText || 'موجود در انبار'}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-500 px-3.5 py-1.5 rounded-full border border-rose-200/50 shadow-sm">
              <AlertCircle size={16} className="text-rose-500" />
              <span className="font-medium">{stockText || 'ناموجود'}</span>
            </span>
          )}
        </div>
        {product.sku && (
          <span className="text-xs p-3 py-1 rounded-full border border-gray-100">
            کد محصول: <span className="font-mono font-medium">{product.sku}</span>
          </span>
        )}
      </div>

      {/* --- Pricing Section --- */}
      <div className="relative rounded-2xl p-5 border border-gray-100/80 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col items-start gap-1">
          {isOnSale && regularPrice > price && (
            <div className="flex items-center gap-3">
              <b className="text-sm line-through flex items-center">
                {formattedRegularPrice}
                <Toman className="inline-block w-3 h-3 mr-0.5" />
              </b>
              <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {discountPercent}% تخفیف
              </span>
            </div>
          )}
          
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl md:text-3xl font-bold">
              {formattedPrice}
            </span>
            <span className="text-sm font-normal text-gray-500 mb-1 flex items-center">
              <Toman className="inline-block w-4 h-4" />
            </span>
          </div>
          
          {isOnSale && regularPrice > price && (
            <span className="text-xs text-emerald-600 font-medium px-2 py-0.5 rounded-full border border-emerald-100/50 mt-0.5">
              ✓ قیمت فوق‌العاده
            </span>
          )}
        </div>
      </div>

      {/* --- Short Description --- */}
      {product.short_description && (
        <div className="text-sm leading-7 p-4 rounded-xl border border-gray-100/80">
          <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
        </div>
      )}

      {/* --- Quantity & Add to Cart --- */}
      <div className="flex items-start sm:items-center gap-4 mt-1">
        {isInStock && (
          <div className="flex items-center bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
            <button
              className="px-4 py-2.5 text-gray-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-500 transition-all duration-200 text-lg font-bold disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              aria-label="کاهش تعداد"
            >
              −
            </button>
            <span className="px-4 py-2.5 bg-white text-gray-800 font-bold text-sm min-w-[48px] text-center">
              {quantity}
            </span>
            <button
              className="px-4 py-2.5 text-gray-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-500 transition-all duration-200 text-lg font-bold disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= (product.add_to_cart?.maximum || 9999)}
              aria-label="افزایش تعداد"
            >
              +
            </button>
          </div>
        )}
        
        <button
          className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm md:text-base transition-all duration-300 ${
            isInStock && !isAddingToCart
              ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-gray-200 cursor-not-allowed text-gray-400'
          }`}
          onClick={onAddToCart}
          disabled={!isInStock || isAddingToCart}
        >
          {isAddingToCart ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>در حال افزودن...</span>
            </>
          ) : (
            <>
              <ShoppingCart size={20} className="drop-shadow-sm" />
              <span>{isInStock ? 'افزودن به سبد خرید' : 'ناموجود'}</span>
            </>
          )}
        </button>
      </div>

      {/* --- Product Features --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
        <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-gray-50/80 to-white border border-gray-100/80 hover:border-blue-200/50 hover:shadow-md hover:shadow-blue-100/30 transition-all duration-300 cursor-default">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
            <Truck className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-gray-700">ارسال سریع</h4>
            <p className="text-[10px] text-gray-400">ارسال در کمتر از ۲۴ ساعت</p>
          </div>
        </div>
        
        <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-gray-50/80 to-white border border-gray-100/80 hover:border-emerald-200/50 hover:shadow-md hover:shadow-emerald-100/30 transition-all duration-300 cursor-default">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-gray-700">پرداخت امن</h4>
            <p className="text-[10px] text-gray-400">پرداخت با درگاه امن</p>
          </div>
        </div>
        
        <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-gray-50/80 to-white border border-gray-100/80 hover:border-amber-200/50 hover:shadow-md hover:shadow-amber-100/30 transition-all duration-300 cursor-default">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
            <RotateCcw className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-gray-700">ضمانت بازگشت</h4>
            <p className="text-[10px] text-gray-400">۷ روز ضمانت بازگشت</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductInfo;