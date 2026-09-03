// src/pages/Store/Store.jsx - نسخه بهینه‌شده با ProductList
import React, { useMemo,useRef,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetProductsQuery } from '../../features/products/productsAPI';
import { useGetCategoriesQuery } from '../../features/categories/categoriesAPI';
import { ShoppingBag } from 'lucide-react';
import Navbar from '../../components/common/Navbar/navbar';
import ProductList from '../../components/common/ProductList/ProductList';
import { ScrollToTop } from '../../ScrollToTop';
const Store = () => {
  // ============================================
  // Redux State
  // ============================================
  const { filters: productFilters } = useSelector((state) => state.products);
  const { search: searchTerm } = productFilters;
  // ============================================
  // API Calls
  // ============================================
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError 
  } = useGetProductsQuery({
    page: 1,
    perPage: 100,
    search: searchTerm || '',
  });
  
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({ 
    perPage: 50 
  });

  // ============================================
  // Memoized Data
  // ============================================
  const categories = useMemo(() => {
    if (!categoriesData) return [];
    if (Array.isArray(categoriesData)) return categoriesData;
    if (categoriesData?.data && Array.isArray(categoriesData.data)) return categoriesData.data;
    return [];
  }, [categoriesData]);

  const products = useMemo(() => {
    if (!productsData?.products) return [];
    return productsData.products;
  }, [productsData]);

  const loading = productsLoading || categoriesLoading;

  // ============================================
  // Banner Data (استاتیک برای فروشگاه)
  // ============================================
  const bannerData = {
    title: 'فروشگاه',
    description: 'بهترین محصولات با بهترین قیمت',
    icon: <ShoppingBag className="w-6 h-6 text-white" />,
  };

  return (
    <div className="min-h-screen" dir="rtl">
    <ScrollToTop/>
      <Navbar />
      <ProductList
        products={products}
        categories={categories}
        isLoading={loading}
        error={productsError}
        banner={bannerData}
        bannerTitle="فروشگاه"
        bannerIcon={<ShoppingBag className="w-6 h-6 text-white" />}
        bannerColor="from-red-500 via-pink-500 to-purple-600"
        title="بهترین محصولات با بهترین قیمت"
        emptyMessage="محصولی یافت نشد"
        emptyIcon="🛍️"
        colorScheme="red"
        itemsPerPage={20}
        showRank={false}
        showDiscount={true}
        minDiscountFilter={true}
        showSearch={true}
        showPriceFilter={true}
        showStockFilter={true}
        showRatingFilter={true}
        showOnSaleFilter={true}
        showInStockFilter={true}
      />
    </div>
  );
};

export default Store;