// src/components/home/FeaturedProducts/FeaturedProducts.jsx
import { useState, useRef, useMemo, useCallback, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFeaturedProductsQuery } from '../../../../features/products/productsAPI';
import { addToCart, removeFromCart, updateQuantity } from '../../../../features/cart/cartSlice';
import { ProductCard } from '../../../store/components/ProductCard/product-card';
import { SectionHeader } from "../SectionHeader/section-header";

const FeaturedSkeleton = () => (
  <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
    <SectionHeader title="محصولات ویژه" showArrows={true} />
    <div className="flex gap-4 overflow-hidden p-5">
      {[...Array(5)].map((_, i) => <div key={i} className="h-80 w-[170px] sm:w-[200px] md:w-[220px] lg:w-[240px] shrink-0 animate-pulse rounded-xl bg-muted" />)}
    </div>
  </section>
);

export const FeaturedProducts = memo(() => {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { data: productsData, isLoading } = useGetFeaturedProductsQuery({ perPage: 12 });
  const scrollContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 50);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 50);
    }
  }, []);

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

  // ✅ اصلاح: استخراج محصولات از پاسخ API
  const products = useMemo(() => {
    if (!productsData) return [];
    // اگر productsData آرایه بود
    if (Array.isArray(productsData)) return productsData;
    // اگر productsData شامل products بود
    if (productsData?.products && Array.isArray(productsData.products)) return productsData.products;
    // اگر productsData شامل data بود
    if (productsData?.data && Array.isArray(productsData.data)) return productsData.data;
    return [];
  }, [productsData]);

  const transformedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.map(product => ({
      ...product,
      inCart: cartItems.some(item => String(item.id) === String(product.id)),
      cartQuantity: cartItems.find(item => String(item.id) === String(product.id))?.quantity || 0,
    }));
  }, [products, cartItems]);

  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price) || 0,
      image: product.images?.[0]?.src || null,
      quantity: 1,
    }));
  }, [dispatch]);

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

  if (isLoading) return <FeaturedSkeleton />;
  if (!transformedProducts || transformedProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 min-h-[200px] md:min-h-[250px] lg:min-h-[350px]">
      <SectionHeader title="محصولات ویژه" subtitle="جدیدترین و پرفروش‌ترین محصولات" showArrows={true}
        onPrevClick={scrollLeft} onNextClick={scrollRight}
        prevDisabled={!canScrollLeft} nextDisabled={!canScrollRight}
      />
      <div ref={scrollContainerRef} className="featured-products-scroll" style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0.25rem 1rem 0.25rem', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', scrollPadding: '0 1rem' }}>
        {transformedProducts.map((product, index) => (
          <div key={product.id || index} className="product-card-wrapper" style={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}>
            <ProductCard product={product} highlighted={index === 0} onAddToCart={() => handleAddToCart(product)}
              cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              isInCart={product.inCart} cartQuantity={product.cartQuantity}
              className={`${isMobile ? 'w-[150px]' : 'w-[170px] sm:w-[200px] md:w-[220px] lg:w-[240px]'} h-full`}
              Content='grid gap-3 w-full md:w-auto h-full' showRating={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
});

FeaturedProducts.displayName = 'FeaturedProducts';
export default FeaturedProducts;