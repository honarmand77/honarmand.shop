// src/components/common/ProductList/ProductList.jsx
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from '../../../pages/store/components/ProductCard/product-card';
import { addToCart, removeFromCart, updateQuantity } from '../../../features/cart/cartSlice';
import { setSearch } from '../../../features/products/productsSlice';
import { extractImageUrl, isValidImageUrl, extractTitle } from '../../../utils/extractImage';
import Filters from '../Filters/Filters';
import { Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

// ============================================
// 1. اسکلتون
// ============================================
const ProductListSkeleton = ({ count = 8 }) => (
  <div className="grid gap-3 w-full sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-primary-foreground rounded-xl shadow-sm overflow-hidden md:h-full h-50">
        <div className="aspect-square bg-primary-foreground animate-pulse" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-primary-foreground rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-primary-foreground rounded w-1/2 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-4 bg-primary-foreground rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-primary-foreground rounded w-1/4 animate-pulse" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ============================================
// 2. کامپوننت اصلی ProductList
// ============================================
const ProductList = ({
  // داده‌ها
  products: productsData = [],
  categories = [],
  isLoading = false,
  error = null,
  
  // بنر
  banner = null,
  bannerTitle = 'محصولات',
  bannerIcon = null,
  bannerColor = 'from-pink-500 to-red-500',
  title = 'محصولات',
  
  // پیام‌ها
  emptyMessage = 'محصولی یافت نشد',
  emptyIcon = '🎯',
  
  // تنظیمات
  colorScheme = 'pink',
  itemsPerPage = 20,
  showRank = false,
  showDiscount = true,
  minDiscountFilter = false,
  
  // فیلترها
  showSearch = true,
  showPriceFilter = true,
  showStockFilter = true,
  showRatingFilter = true,
  showOnSaleFilter = true,
  showInStockFilter = true,
}) => {
  const dispatch = useDispatch();
  
  // ============================================
  // Redux State
  // ============================================
  const { items: cartItems } = useSelector((state) => state.cart);
  const { filters: productFilters } = useSelector((state) => state.products);
  const { search: searchTerm } = productFilters;
  
  // ============================================
  // Local State
  // ============================================
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('discount');
  const [priceRange, setPriceRange] = useState('all');
  const [stockStatus, setStockStatus] = useState('all');
  const [minRating, setMinRating] = useState('0');
  const [minDiscount, setMinDiscount] = useState('0');
  const [onSale, setOnSale] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // ============================================
  // Cart Helpers
  // ============================================
  const isProductInCart = useCallback((productId) => {
    if (!productId) return false;
    return cartItems.some(item => String(item.id) === String(productId));
  }, [cartItems]);

  const getProductQuantity = useCallback((productId) => {
    if (!productId) return 0;
    const item = cartItems.find(item => String(item.id) === String(productId));
    return item?.quantity || 0;
  }, [cartItems]);

  // ============================================
  // Transform Products
  // ============================================
  const transformedProducts = useMemo(() => {
    if (!productsData || productsData.length === 0) return [];
    
    return productsData.map((product, index) => {
      const productId = product?.id;
      const image = extractImageUrl(product);
      const productName = extractTitle(product) || product.name || 'نام محصول';
      const price = Number(product.price || 0);
      const oldPrice = Number(product.regular_price || 0);
      const discountPercent = oldPrice > price && oldPrice > 0 
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : 0;
      
      return {
        ...product,
        id: productId,
        name: productName,
        title: productName,
        image: image && isValidImageUrl(image) ? image : '/placeholder-image.jpg',
        price,
        oldPrice,
        average_rating: parseFloat(product.average_rating) || 0,
        rating: parseFloat(product.average_rating) || 0,
        review_count: product.review_count || 0,
        inCart: isProductInCart(productId),
        cartQuantity: getProductQuantity(productId),
        isLiked: false,
        originalProduct: product,
        discountPercent,
        isOnSale: product.on_sale || (oldPrice > price),
        rank: index + 1,
        salesScore: (product.review_count || 0) + (parseFloat(product.average_rating) || 0) * 10,
      };
    });
  }, [productsData, isProductInCart, getProductQuantity]);

  // ============================================
  // Handlers
  // ============================================
  const handleAddToCart = useCallback((product) => {
    if (!product) return;
    const productData = product.originalProduct || product;
    dispatch(addToCart({
      id: productData.id,
      name: productData.name,
      price: parseFloat(productData.price) || 0,
      image: product.image || null,
      quantity: 1,
      slug: productData.slug,
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

  const clearSearch = useCallback(() => {
    dispatch(setSearch(''));
    setCurrentPage(1);
  }, [dispatch]);

  const clearAllFilters = useCallback(() => {
    setSelectedCategory('all');
    setSortBy('discount');
    setPriceRange('all');
    setStockStatus('all');
    setMinRating('0');
    setMinDiscount('0');
    setOnSale(false);
    setInStock(false);
    dispatch(setSearch(''));
    setCurrentPage(1);
  }, [dispatch]);

  const applyFilters = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // ============================================
  // Filter and sort products
  // ============================================
  const filteredProducts = useMemo(() => {
    let filtered = [...transformedProducts];

    // فیلتر موجودی
    if (stockStatus === 'instock') {
      filtered = filtered.filter(p => p.in_stock === true);
    } else if (stockStatus === 'outofstock') {
      filtered = filtered.filter(p => p.in_stock === false);
    }

    // فیلتر دسته‌بندی
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.categories?.some(cat => cat.id === parseInt(selectedCategory))
      );
    }

    // فیلتر جستجو
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // فیلتر قیمت
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        const price = p.price || 0;
        if (max) return price >= min && price <= max;
        return price >= min;
      });
    }

    // فیلتر امتیاز
    if (parseInt(minRating) > 0) {
      filtered = filtered.filter(p => (p.average_rating || 0) >= parseInt(minRating));
    }

    // فیلتر حداقل تخفیف
    if (parseInt(minDiscount) > 0) {
      filtered = filtered.filter(p => (p.discountPercent || 0) >= parseInt(minDiscount));
    }

    // فیلتر تخفیف‌دار
    if (onSale) {
      filtered = filtered.filter(p => p.isOnSale === true);
    }

    // فیلتر موجودی فوری
    if (inStock) {
      filtered = filtered.filter(p => p.in_stock === true);
    }

    // مرتب‌سازی
    switch (sortBy) {
      case 'discount':
        filtered.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.salesScore || 0) - (a.salesScore || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'best-selling':
        filtered.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
        break;
      default:
        filtered.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    }

    return filtered;
  }, [transformedProducts, selectedCategory, searchTerm, sortBy, priceRange, stockStatus, minRating, minDiscount, onSale, inStock]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts, itemsPerPage]);

  // ============================================
  // Reset page when filters change
  // ============================================
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy, priceRange, stockStatus, minRating, minDiscount, onSale, inStock]);

  // ============================================
  // Check if any filter is active
  // ============================================
  const hasActiveFilters = useMemo(() => {
    return selectedCategory !== 'all' || 
           searchTerm || 
           priceRange !== 'all' || 
           stockStatus !== 'all' || 
           minRating !== '0' || 
           minDiscount !== '0' ||
           onSale || 
           inStock;
  }, [selectedCategory, searchTerm, priceRange, stockStatus, minRating, minDiscount, onSale, inStock]);

  // ============================================
  // Loading State
  // ============================================
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-2">
        <div className={`md:h-80 h-30 bg-gradient-to-r ${bannerColor} animate-pulse rounded-lg mb-2`} />
        <div className="py-4 sm:py-6 mb-1">
          <div className="rounded-lg">
            <div className="flex flex-wrap items-center gap-3">
              <div className="md:h-10 h-0 w-60 bg-primary-foreground rounded-xl animate-pulse border border-1" />
              <div className="h-10 w-70 bg-primary-foreground rounded-xl animate-pulse border border-1" />
              <div className="h-10 w-15 bg-primary-foreground rounded-xl animate-pulse border border-1 " />
              <div className="md:h-10 h-0 w-30 bg-primary-foreground rounded-xl animate-pulse border border-1 " />
            </div>
          </div>
        </div>
        <ProductListSkeleton />
      </div>
    );
  }


  // ============================================
  // Banner Component - اصلاح‌شده
  // ============================================
  const BannerContent = () => {
    // اگر بنر از نوع object با image باشد
    if (banner && typeof banner === 'object' && banner.image) {
      return (
        <div className="relative h-full rounded-lg overflow-hidden shadow-xl mb-2">
          <img 
            src={banner.image} 
            alt={banner.title || bannerTitle}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
      );
    }

    // اگر banner از نوع string (URL) باشد
    if (banner && typeof banner === 'string') {
      return (
        <div className="relative h-full rounded-lg overflow-hidden shadow-xl mb-2">
          <img 
            src={banner} 
            alt={bannerTitle}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
      );
    }

    // اگر بنر از نوع object با تصویر در feature_image یا featured_image باشد
    if (banner && typeof banner === 'object' && (banner.feature_image || banner.featured_image)) {
      const imageUrl = banner.feature_image || banner.featured_image;
      return (
        <div className="relative h-full rounded-lg overflow-hidden shadow-xl mb-2">
          <img 
            src={imageUrl} 
            alt={banner.title || bannerTitle}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
      );
    }

    // اگر بنر از نوع object با data (از API) باشد
    if (banner && typeof banner === 'object' && banner.data) {
      const imageUrl = banner.data.image || banner.data.featured_image || banner.data.images?.[0]?.src;
      if (imageUrl) {
        return (
          <div className="relative h-full rounded-lg overflow-hidden shadow-xl mb-2">
            <img 
              src={imageUrl} 
              alt={banner.data.title || bannerTitle}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          </div>
        );
      }
    }

    // Default: بنر گرادیانت (بدون تصویر)
    return (
      <div className={`relative md:h-50 h-35 rounded-lg overflow-hidden bg-gradient-to-r ${bannerColor} shadow-xl mb-2`}>
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8">
          <div className="text-white">
            <h1 className="text-xl md:text-3xl font-bold">{bannerTitle}</h1>
            <p className="text-white/80 text-sm md:text-base">{title}</p>
          </div>
          {bannerIcon && (
            <div className="text-white/20">
              {bannerIcon}
            </div>
          )}
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </div>
    );
  };

  // ============================================
  // Main Render
  // ============================================
  return (
    <div className="max-w-7xl mx-auto p-2">
      {/* Banner */}
      <BannerContent />

      {/* Filters */}
      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(value) => {
          setSelectedCategory(value);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(value) => {
          setSortBy(value);
          setCurrentPage(1);
        }}
        onClearFilters={clearAllFilters}
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          dispatch(setSearch(value));
          setCurrentPage(1);
        }}
        onClearSearch={clearSearch}
        priceRange={priceRange}
        onPriceRangeChange={(value) => {
          setPriceRange(value);
          setCurrentPage(1);
        }}
        stockStatus={stockStatus}
        onStockStatusChange={(value) => {
          setStockStatus(value);
          setCurrentPage(1);
        }}
        minRating={minRating}
        onMinRatingChange={(value) => {
          setMinRating(value);
          setCurrentPage(1);
        }}
        minDiscount={minDiscount}
        onMinDiscountChange={(value) => {
          setMinDiscount(value);
          setCurrentPage(1);
        }}
        onSale={onSale}
        onOnSaleChange={(value) => {
          setOnSale(value);
          setCurrentPage(1);
        }}
        inStock={inStock}
        onInStockChange={(value) => {
          setInStock(value);
          setCurrentPage(1);
        }}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        showMobileFilters={showMobileFilters}
        onToggleMobileFilters={() => setShowMobileFilters(!showMobileFilters)}
        applyFilters={applyFilters}
        colorScheme={colorScheme}
        placeholder="جستجوی محصول..."
        isFilterActive={hasActiveFilters}
      />

      {/* Results Count & View Mode */}
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredProducts.length > 0 ? `${filteredProducts.length.toLocaleString()} محصول` : 'محصولی یافت نشد'}
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
          <div className="text-6xl mb-4">{emptyIcon}</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{emptyMessage}</h3>
          <p className="text-gray-500 dark:text-gray-400">سعی کنید فیلترهای دیگری را امتحان کنید</p>
          <button
            onClick={clearAllFilters}
            className={`mt-4 bg-${colorScheme}-600 text-white px-6 py-2 rounded-xl hover:bg-${colorScheme}-700 transition`}
          >
            حذف همه فیلترها
          </button>
        </div>
      ) : (
        <>
          <div className={`grid gap-3 w-full ${
            viewMode === 'grid' 
              ? ' sm:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {paginatedProducts.map((product) => (
              <div key={product.id} className="relative">
                {/* Rank Badge */}
                {showRank && product.rank <= 3 && (
                  <div className={`absolute -top-2 -right-2 z-10 shadow-lg ${
                    product.rank === 1 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-yellow-300/50' 
                      : product.rank === 2 
                      ? 'bg-gradient-to-r from-gray-300 to-gray-400 shadow-gray-300/50' 
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 shadow-amber-300/50'
                  } text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse`}>
                    #{product.rank}
                  </div>
                )}

                {/* Discount Badge */}
                {showDiscount && product.discountPercent >= 30 && (
                  <div className={`absolute -top-2 -right-2 z-10 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 ${
                    product.discountPercent >= 50 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-300/50 animate-pulse' 
                      : 'bg-gradient-to-r from-orange-400 to-pink-400 shadow-pink-300/30'
                  }`}>
                    {product.discountPercent}%
                  </div>
                )}

                <ProductCard 
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onWishlist={handleWishlist}
                  cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  isInCart={product.inCart}
                  cartQuantity={product.cartQuantity}
                  isLiked={product.isLiked}
                  showRating={true}
                  highlighted={product.rank <= 3 || product.discountPercent >= 40}
                  className='md:grid md:grid-col-4 flex flex-row w-full h-full md:gap-2 gap:5'
                  Content='grid gap-5 w-full md:p-0'
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-primary-foreground dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                قبلی
              </button>
              
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                let page = i + 1;
                if (totalPages > 10 && currentPage > 5) {
                  page = currentPage - 5 + i;
                  if (page > totalPages) return null;
                }
                return page && (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl transition text-sm text-primary ${
                      currentPage === page
                        ? `bg-primary text-primary-foreground`
                        : 'bg-primary-foreground dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 hover:text-primary-foreground dark:text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-primary-foreground dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1"
              >
                بعدی
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductList;