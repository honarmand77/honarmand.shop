// src/components/product-card/product-card.jsx - نسخه نهایی با extractImageUrl
import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  Minus, 
  Plus,
  Star,
  X,
} from "lucide-react";
import { OptimizedImage } from '../../../../components/ui/OptimizedImage/OptimizedImage';
import { addToCart, removeFromCart, updateQuantity } from '../../../../features/cart/cartSlice';
import { useGetProductByIdQuery } from '../../../../features/products/productsAPI';
import { extractImageUrl, extractTitle, isValidImageUrl } from '../../../../utils/extractImage';
import Toman from '../../../../assets/icons/toman'; 

// ============================================
// Helper Functions
// ============================================
const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) return '۰';
  return price.toLocaleString('fa-IR');
};

const convertRatingToStars = (ratingValue) => {
  if (ratingValue === undefined || ratingValue === null || isNaN(ratingValue)) {
    return 0;
  }

  const num = Number(ratingValue);
  
  if (num <= 5) return num;
  if (num <= 10) return num / 2;
  if (num <= 20) return num / 4;
  if (num <= 100) return (num / 100) * 5;
  return Math.min(num / 10, 5);
};

const calculateDiscount = (oldPrice, price) => {
  if (oldPrice > price && oldPrice > 0) {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }
  return 0;
};

// ============================================
// Simple Rating
// ============================================
const SimpleRating = memo(({ rating = 0, count = 0 }) => {
  const starRating = useMemo(() => {
    const val = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
    return convertRatingToStars(val);
  }, [rating]);

  if (starRating === 0 || count === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <Star size={12} className="fill-current text-yellow-500" strokeWidth={1.5} />
      <span className="text-xs font-medium text-gray-700">
        {starRating.toFixed(1)}
      </span>
      {count > 0 && (
        <span className="text-[10px] text-gray-400">
          ({count})
        </span>
      )}
    </div>
  );
});

SimpleRating.displayName = 'SimpleRating';

// ============================================
// Main Component
// ============================================
function ProductCardComponent({ 
  product = {},
  highlighted = false,
  onAddToCart: externalAddToCart,
  onRemoveFromCart: externalRemoveFromCart,
  onUpdateQuantity: externalUpdateQuantity,
  onWishlist,
  isInCart: externalIsInCart = false,
  cartQuantity: externalCartQuantity = 0,
  isLiked = false,
  className = "",
  showRating = true,
  Content = "grid gap-2 w-full",
}) {
  // ============================================
  // Hooks
  // ============================================
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ============================================
  // Refs
  // ============================================
  const mountedRef = useRef(true);
  const toastTimerRef = useRef(null);

  // ============================================
  // State
  // ============================================
  const [isAdding, setIsAdding] = useState(false);
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });
  const [ratingLoaded, setRatingLoaded] = useState(false);

  // ============================================
  // Product Data
  // ============================================
  const productId = useMemo(() => {
    const id = product?.id || product?.product_id;
    if (!id) return null;
    const numId = Number(id);
    return !isNaN(numId) && numId > 0 ? numId : null;
  }, [product?.id, product?.product_id]);

  // ✅ دریافت ریتینگ محصول از API
  const { data: productDetail, isLoading: ratingLoading } = useGetProductByIdQuery(
    productId,
    { skip: !productId || !showRating }
  );

  // ✅ استخراج تصویر با استفاده از extractImageUrl
  const productImage = useMemo(() => {
    const image = extractImageUrl(product);
    // اگر تصویر پیدا نشد، از placeholder استفاده کن
    return image && isValidImageUrl(image) ? image : '/placeholder.svg';
  }, [product]);

  const productName = useMemo(() => {
    return extractTitle(product) || 'محصول نمونه';
  }, [product]);

  const productData = useMemo(() => {
    const safeProduct = product || {};
    
    let price = 0;
    let oldPrice = 0;
    
    if (safeProduct.prices) {
      price = safeProduct.prices.price || safeProduct.prices.regular_price || 0;
      oldPrice = safeProduct.prices.regular_price || safeProduct.prices.price || 0;
    } else {
      price = safeProduct.price || safeProduct.discounted_price || 0;
      oldPrice = safeProduct.oldPrice || safeProduct.regular_price || safeProduct.compare_at_price || 0;
    }

    if (oldPrice < price) {
      oldPrice = price;
    }

    return { price, oldPrice };
  }, [product]);

  const { price: productPrice, oldPrice: productOldPrice } = productData;

  // ============================================
  // Cart State از Redux
  // ============================================
  const isProductInCart = useMemo(() => {
    if (externalIsInCart) return true;
    if (!productId) return false;
    return cartItems.some(item => String(item.id) === String(productId));
  }, [externalIsInCart, productId, cartItems]);

  const productCartQuantity = useMemo(() => {
    if (externalCartQuantity > 0) return externalCartQuantity;
    if (!productId) return 0;
    const item = cartItems.find(item => String(item.id) === String(productId));
    return item?.quantity || 0;
  }, [externalCartQuantity, productId, cartItems]);

  // ============================================
  // Rating Data
  // ============================================
  useEffect(() => {
    if (productDetail) {
      setRatingData({
        average: parseFloat(productDetail.average_rating) || 0,
        count: productDetail.review_count || 0,
      });
      setRatingLoaded(true);
    } else if (product) {
      setRatingData({
        average: parseFloat(product.average_rating) || 0,
        count: product.review_count || 0,
      });
      setRatingLoaded(true);
    }
  }, [productDetail, product]);

  // ============================================
  // Rating Display
  // ============================================
  const starRating = useMemo(() => {
    const rawRating = ratingData.average || 0;
    return convertRatingToStars(rawRating);
  }, [ratingData.average]);

  const reviewCount = useMemo(() => {
    return ratingData.count || 0;
  }, [ratingData.count]);

  // ============================================
  // Discount
  // ============================================
  const discount = useMemo(() => {
    return calculateDiscount(productOldPrice, productPrice);
  }, [productOldPrice, productPrice]);

  // ============================================
  // Effects
  // ============================================
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsLikedState(isLiked);
  }, [isLiked]);

  // ============================================
  // Navigate to Product Detail
  // ============================================
  const handleProductClick = useCallback((e) => {
    if (e?.target?.closest?.('button')) {
      return;
    }
    if (productId) {
      navigate(`/محصولات/${productId}`);
    }
  }, [productId, navigate]);

  // ============================================
  // Toast Helper
  // ============================================
  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    const toast = document.createElement('div');
    toast.className = `fixed right-5 bottom-20 rounded-lg lg:right-[5vw] z-50 p-3 text-xs ${
      type === 'success' ? 'dark:bg-green-800 bg-green-100' : 'dark:bg-red-100 bg-red-100'
    } dark:text-white text-black transform transition-all duration-300 animate-slideIn max-w-[90vw]`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    toastTimerRef.current = setTimeout(() => {
      toast.classList.add('animate-slideOut');
      setTimeout(() => toast.remove(), 300);
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  // ============================================
  // Cart Functions - با Redux
  // ============================================
  const handleAddToCart = useCallback(async (e) => {
    e?.stopPropagation?.();
    if (!productId) return;
    if (isAdding) return;

    setIsAdding(true);
    try {
      if (externalAddToCart) {
        await externalAddToCart(product, 1);
      } else {
        dispatch(addToCart({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1,
          slug: product.slug,
        }));
      }
      showToast('✅ به سبد خرید اضافه شد', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('❌ خطا در افزودن به سبد خرید', 'error');
    } finally {
      if (mountedRef.current) {
        setIsAdding(false);
      }
    }
  }, [productId, product, productName, productPrice, productImage, externalAddToCart, dispatch, showToast, isAdding]);

  const handleRemoveFromCart = useCallback(async (e) => {
    e?.stopPropagation?.();
    if (!productId) return;

    try {
      if (externalRemoveFromCart) {
        await externalRemoveFromCart(productId);
      } else {
        dispatch(removeFromCart(productId));
      }
      showToast('✅ از سبد خرید حذف شد', 'success');
    } catch (error) {
      console.error('Error removing from cart:', error);
      showToast('❌ خطا در حذف از سبد خرید', 'error');
    }
  }, [productId, externalRemoveFromCart, dispatch, showToast]);

  const handleUpdateQuantity = useCallback(async (newQuantity) => {
    if (!productId) return;

    if (newQuantity <= 0) {
      await handleRemoveFromCart();
      return;
    }

    try {
      if (externalUpdateQuantity) {
        await externalUpdateQuantity(productId, newQuantity);
      } else {
        dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showToast('❌ خطا در بروزرسانی تعداد', 'error');
    }
  }, [productId, externalUpdateQuantity, dispatch, handleRemoveFromCart, showToast]);

  const handleIncrement = useCallback((e) => {
    e?.stopPropagation?.();
    if (productCartQuantity > 0) {
      handleUpdateQuantity(productCartQuantity + 1);
    }
  }, [productCartQuantity, handleUpdateQuantity]);

  const handleDecrement = useCallback((e) => {
    e?.stopPropagation?.();
    if (productCartQuantity > 0) {
      handleUpdateQuantity(productCartQuantity - 1);
    }
  }, [productCartQuantity, handleUpdateQuantity]);

  // ============================================
  // Wishlist
  // ============================================
  const handleWishlist = useCallback((e) => {
    e?.stopPropagation?.();
    const newLikedState = !isLikedState;
    setIsLikedState(newLikedState);
    
    if (onWishlist) {
      onWishlist({ ...product, isLiked: newLikedState });
    }
  }, [isLikedState, product, onWishlist]);

  // ============================================
  // Cart Button
  // ============================================
  const cartButton = useMemo(() => {
    if (isProductInCart && productCartQuantity > 0) {
      return (
        <div className="mt-auto flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleDecrement}
            className="flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-border bg-background text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md active:scale-95"
            aria-label="کم کردن تعداد"
            disabled={isAdding}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          
          <span className="flex h-8 min-w-[40px] items-center justify-center border-y border-border bg-background text-sm font-semibold select-none">
            {productCartQuantity}
          </span>
          
          <button
            type="button"
            onClick={handleIncrement}
            className="flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 border-border bg-background text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md active:scale-95"
            aria-label="افزایش تعداد"
            disabled={isAdding}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          
          <button
            type="button"
            onClick={handleRemoveFromCart}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-destructive/30 bg-background text-destructive transition-all hover:border-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-md active:scale-95"
            aria-label="حذف از سبد خرید"
            disabled={isAdding}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding}
        className={
          highlighted
            ? "mt-auto w-full rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
            : "mt-auto w-full rounded-md border border-border py-2 text-xs font-semibold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
        }
      >
        {isAdding ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            در حال افزودن...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <ShoppingCart className="h-3.5 w-3.5" />
            افزودن به سبد
          </span>
        )}
      </button>
    );
  }, [
    isProductInCart, 
    productCartQuantity, 
    isAdding, 
    handleDecrement, 
    handleIncrement, 
    handleRemoveFromCart, 
    handleAddToCart,
    highlighted
  ]);

  // ============================================
  // Render
  // ============================================
  return (
    <div 
      className={`
        group flex flex-col gap-1 rounded-xl border border-border bg-card p-2 ${className} 
        transition-all duration-300 hover:shadow-xl hover:border-primary/20 
        ${highlighted ? 'ring-2 ring-primary shadow-lg' : ''} 
        snap-start shrink-0 
        min-w-[180px] w-[200px] md:min-w-[230px] lg:min-w-[250px]
        hover:-translate-y-1
        cursor-pointer
      `}
      role="link"
      tabIndex={0}
      onClick={handleProductClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleProductClick(e);
        }
      }}
    >
      {/* Image Section */}
      <div className="relative flex aspect-square items-center justify-center rounded-lg bg-muted/50">
        {discount > 0 && (
          <span className="absolute z-10 left-2 top-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
            -{discount}%
          </span>
        )}
        
        {isProductInCart && productCartQuantity > 0 && (
          <span className="absolute left-2 bottom-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-lg">
            {productCartQuantity} در سبد
          </span>
        )}
        
        <button
          type="button"
          aria-label="افزودن به علاقه‌مندی‌ها"
          onClick={handleWishlist}
          className="absolute z-10 right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md transition-all hover:scale-110 hover:shadow-lg active:scale-95"
        >
          <Heart 
            className={`h-3.5 w-3.5 transition-colors ${
              isLikedState 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-400 group-hover:text-red-400'
            }`} 
          />
        </button>
        
        <OptimizedImage
          src={productImage}
          alt={productName}
          className="h-[150px] w-[150px] object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={150}
          height={150}
        />
      </div>

      {/* Content */}
      <div className={Content}>
        <div className='flex justify-between w-full'>
          <h3 className="truncate text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
            {productName}
          </h3>

          {showRating && ratingLoaded && (
            <div className="mt-0.5" onClick={(e) => e.stopPropagation()}>
              <SimpleRating 
                rating={starRating} 
                count={reviewCount}
              />
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-5 grid items-center gap-2">
          {productOldPrice > 0 && productOldPrice > productPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(productOldPrice)}
            </span>
          )}
          <span className="text-sm font-bold text-foreground flex items-center">
            {formatPrice(productPrice)} 
            <span className="text-[10px] mr-0.5"><Toman/></span>
          </span>
        </div>

        {/* Cart Button */}
        {cartButton}
      </div>
    </div>
  );
}

// ============================================
// Memoized Export
// ============================================
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.product?.id === nextProps.product?.id &&
    prevProps.isInCart === nextProps.isInCart &&
    prevProps.cartQuantity === nextProps.cartQuantity &&
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.showRating === nextProps.showRating
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;