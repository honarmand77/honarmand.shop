// src/pages/category/Category.jsx
import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../features/products/productsAPI';
import { useGetCategoriesQuery } from '../../features/categories/categoriesAPI';
import { Folder } from 'lucide-react';
import Navbar from '../../components/common/Navbar/navbar';
import ProductList from '../../components/common/ProductList/ProductList';

const Category = () => {
  const { name } = useParams();
  
  // ============================================
  // Local State
  // ============================================
  const [categoryData, setCategoryData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ============================================
  // API Calls
  // ============================================
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({ 
    perPage: 50 
  });

  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError 
  } = useGetProductsQuery({
    page: currentPage,
    perPage: itemsPerPage,
    category: categoryData?.id || '',
    orderBy: 'popularity',
    order: 'desc',
  });

  // ============================================
  // Find Category by name
  // ============================================
  useEffect(() => {
    if (!categoriesData || !name) return;

    let categories = [];
    if (Array.isArray(categoriesData)) {
      categories = categoriesData;
    } else if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      categories = categoriesData.data;
    }

    const decodedName = decodeURIComponent(name);
    const foundCategory = categories.find(cat => cat.name === decodedName);
    
    if (foundCategory) {
      setCategoryData(foundCategory);
    }
  }, [categoriesData, name]);

  // ============================================
  // Memoized Data
  // ============================================
  const products = useMemo(() => {
    if (!productsData?.products) return [];
    return productsData.products;
  }, [productsData]);

  const totalProducts = useMemo(() => {
    return productsData?.total || 0;
  }, [productsData]);

  const loading = productsLoading || categoriesLoading;

  // ============================================
  // Banner Data
  // ============================================
  const bannerData = {
    title: categoryData?.name || 'دسته‌بندی',
    description: categoryData?.description || '',
    icon: <Folder className="w-6 h-6 text-white" />,
  };


  // ============================================
  // Error State
  // ============================================
  if (productsError || !categoryData) {
    return (
      <div className="min-h-screen" dir="rtl">
        <Navbar />
        <div className="max-w-7xl mx-auto p-2 text-center py-16">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-600 mb-2">
            {!categoryData ? 'دسته‌بندی یافت نشد' : 'خطا در بارگذاری محصولات'}
          </h3>
          <p className="text-gray-500">
            {!categoryData ? 'دسته‌بندی مورد نظر شما موجود نیست.' : productsError?.message || 'خطای ناشناخته'}
          </p>
          <Link
            to="/فروشگاه"
            className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  // ============================================
  // Main Render
  // ============================================
  return (
    <div className="min-h-screen" dir="rtl">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-2 pt-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 px-2">
          <Link to="/" className="hover:text-red-600 transition-colors">خانه</Link>
          <span className="text-gray-300">/</span>
          <Link to="/فروشگاه" className="hover:text-red-600 transition-colors">فروشگاه</Link>
          <span className="text-gray-300">/</span>
          <span className="text-red-600 font-medium">
            {categoryData?.name}
          </span>
        </nav>
      </div>

      {/* Product List */}
      <ProductList
        products={products}
        categories={[]} // خالی می‌گذاریم چون نیازی به نمایش دسته‌بندی‌ها در سایدبار نیست
        isLoading={loading}
        error={productsError}
        banner={bannerData}
        bannerTitle={categoryData?.name || 'دسته‌بندی'}
        bannerIcon={<Folder className="w-6 h-6 text-white" />}
        bannerColor="from-blue-500 via-purple-500 to-indigo-600"
        title={`محصولات ${categoryData?.name}`}
        emptyMessage={`محصولی در دسته‌بندی ${categoryData?.name} یافت نشد`}
        emptyIcon="📂"
        colorScheme="indigo"
        itemsPerPage={itemsPerPage}
        showRank={false}
        showDiscount={true}
        minDiscountFilter={false}
        showSearch={true}
        showPriceFilter={true}
        showStockFilter={true}
        showRatingFilter={true}
        showOnSaleFilter={true}
        showInStockFilter={true}
        hideCategories={true} // مخفی کردن سایدبار دسته‌بندی‌ها
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={totalProducts}
      />
    </div>
  );
};

export default Category;