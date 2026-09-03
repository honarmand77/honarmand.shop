// src/pages/product/components/RelatedProducts.jsx
import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../../../features/products/productsAPI';
import { addToCart, removeFromCart, updateQuantity } from '../../../../features/cart/cartSlice';
import { ProductCard } from '../../../store/components/ProductCard/product-card';
import { ChevronLeft } from 'lucide-react';
import SectionHeader from '../../../home/components/SectionHeader/section-header';

const RelatedProducts = ({ productId, product }) => {
  const dispatch = useDispatch();
  
  // دریافت از Redux
  const { items: cartItems } = useSelector((state) => state.cart);
  
  // دریافت محصولات مرتبط (همان دسته‌بندی)
  const { data: productsData, isLoading } = useGetProductsQuery({
    perPage: 8,
    category: product?.categories?.[0]?.id || '',
    orderBy: 'popularity',
    order: 'desc',
  });
  
  const scrollContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // تشخیص موبایل
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // بررسی دکمه‌های اسکرول
  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 50);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 50);
    }
  }, []);

  // Event Listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const timeoutId = setTimeout(checkScrollButtons, 200);
    container.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);
    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [checkScrollButtons]);

  // ✅ محصولات مرتبط (حذف محصول فعلی)
  const relatedProducts = useMemo(() => {
    if (!productsData?.products) return [];
    return productsData.products
      .filter(p => p.id !== productId)
      .slice(0, 4);
  }, [productsData, productId]);

  // ✅ تبدیل محصولات با اطلاعات سبد خرید
  const transformedProducts = useMemo(() => {
    if (!relatedProducts || relatedProducts.length === 0) return [];
    
    return relatedProducts.map(product => ({
      ...product,
      inCart: cartItems.some(item => String(item.id) === String(product.id)),
      cartQuantity: cartItems.find(item => String(item.id) === String(product.id))?.quantity || 0,
    }));
  }, [relatedProducts, cartItems]);

  // ✅ توابع سبد خرید
  const handleAddToCart = useCallback((product) => {
    if (!product) return;
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price) || 0,
      image: product.images?.[0]?.src || null,
      quantity: 1,
      slug: product.slug,
    }));
  }, [dispatch]);

  const handleRemoveFromCart = useCallback((productId) => {
    if (!productId) return;
    dispatch(removeFromCart(productId));
  }, [dispatch]);

  const handleUpdateQuantity = useCallback((productId, quantity) => {
    if (!productId) return;
    dispatch(updateQuantity({ id: productId, quantity }));
  }, [dispatch]);

  const handleWishlist = useCallback((product) => {
    console.log('❤️ Wishlist toggled:', product?.name || product?.title);
  }, []);

  // ✅ توابع اسکرول
  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = container.querySelector('.product-card-wrapper')?.offsetWidth || 200;
      container.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = container.querySelector('.product-card-wrapper')?.offsetWidth || 200;
      container.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
    }
  }, []);

  // ============================================
  // Loading State
  // ============================================
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            محصولات مرتبط
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl animate-pulse bg-primary-foreground" />
          ))}
        </div>
      </div>
    );
  }

  // اگر محصولی وجود نداشت
  if (transformedProducts.length === 0) {
    return null;
  }

  // ============================================
  // Main Render
  // ============================================
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 min-h-[200px] md:min-h-[250px] lg:min-h-[350px]">
      <SectionHeader 
        title="محصولات مرتبط" 
        subtitle="محصولات مشابه و مرتبط"
        showArrows={true}
        onPrevClick={scrollLeft}
        onNextClick={scrollRight}
        prevDisabled={!canScrollLeft}
        nextDisabled={!canScrollRight}
        href="/فروشگاه"
      />

      <div 
        ref={scrollContainerRef} 
        className="featured-products-scroll" 
        style={{ 
          display: 'flex', 
          gap: '1rem', 
          padding: '0.5rem 0.25rem 1rem 0.25rem', 
          overflowX: 'auto', 
          overflowY: 'hidden', 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
          WebkitOverflowScrolling: 'touch', 
          scrollSnapType: 'x mandatory', 
          scrollPadding: '0 1rem' 
        }}
      >
        {transformedProducts.map((product, index) => (
          <div 
            key={product.id || index} 
            className="product-card-wrapper" 
            style={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
          >
            <ProductCard 
              product={product} 
              highlighted={index === 0} 
              onAddToCart={() => handleAddToCart(product)}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onWishlist={handleWishlist}
              cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              isInCart={product.inCart} 
              cartQuantity={product.cartQuantity}
              className={`${isMobile ? 'w-[150px]' : 'w-[170px] sm:w-[200px] md:w-[220px] lg:w-[240px]'} h-full`}
              Content='grid gap-3 w-full md:w-auto h-full' 
              showRating={true}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;