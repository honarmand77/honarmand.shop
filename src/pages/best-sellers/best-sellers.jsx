// src/pages/best-sellers/BestSellers.jsx
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetBestSellersQuery } from '../../features/products/productsAPI';
import { useGetCategoriesQuery } from '../../features/categories/categoriesAPI';
import { useGetPopularBannersQuery } from '../../features/banners/bannersAPI';
import { Flame } from 'lucide-react';
import Navbar from '../../components/common/Navbar/navbar';
import ProductList from '../../components/common/ProductList/ProductList';

const BestSellers = () => {
  // ============================================
  // API Calls
  // ============================================
  const { data: productsData, isLoading: productsLoading, error: productsError } = useGetBestSellersQuery({ 
    perPage: 100 
  });
  
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({ perPage: 50 });
  const { data: popularBannersData, isLoading: bannersLoading } = useGetPopularBannersQuery();

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
    if (!productsData) return [];
    if (Array.isArray(productsData)) return productsData;
    if (productsData?.products && Array.isArray(productsData.products)) return productsData.products;
    if (productsData?.data && Array.isArray(productsData.data)) return productsData.data;
    return [];
  }, [productsData]);

  // ============================================
  // Banner Data
  // ============================================
  const bannerData = useMemo(() => {
    if (!popularBannersData) return null;
    let banners = [];
    if (Array.isArray(popularBannersData)) banners = popularBannersData;
    else if (popularBannersData?.data && Array.isArray(popularBannersData.data)) banners = popularBannersData.data;
    else return null;
    return banners[0] || null;
  }, [popularBannersData]);

  const loading = productsLoading || categoriesLoading || bannersLoading;

  return (
    <div className="min-h-screen" dir="rtl">
      <Navbar />
      <ProductList
        products={products}
        categories={categories}
        isLoading={loading}
        error={productsError}
        banner={bannerData}
        bannerTitle="پرفروش‌ترین محصولات"
        bannerIcon={<Flame className="w-6 h-6 text-orange-400" />}
        bannerColor="from-orange-500 to-orange-600"
        title="محصولات پرفروش و محبوب فروشگاه"
        emptyMessage="محصولی یافت نشد"
        emptyIcon="🔍"
        colorScheme="orange"
        itemsPerPage={20}
        showRank={true}
        showDiscount={true}
        minDiscountFilter={true}
      />
    </div>
  );
};

export default BestSellers;