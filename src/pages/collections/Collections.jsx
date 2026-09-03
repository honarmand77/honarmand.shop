import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import CollectionCard from './components/CollectionCard/CollectionCard';
import CollectionHeader from './components/CollectionHeader/CollectionHeader';
import EmptyCollections from './components/EmptyCollections/EmptyCollections';

// ایمپورت از features (با توجه به ساختار پروژه)
import { useGetCategoriesQuery } from '../../features/categories/categoriesAPI';
import { useGetProductsQuery } from '../../features/products/productsAPI';

const Collections = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // دریافت دسته‌بندی‌ها با RTK Query
  const { 
    data: categories = [], 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useGetCategoriesQuery({
    per_page: 50,
    hide_empty: true,
    orderby: 'name',
    order: 'asc'
  });

  // دریافت محصولات با RTK Query
  const { 
    data: products = [], 
    isLoading: productsLoading,
    error: productsError
  } = useGetProductsQuery({
    per_page: 100,
    status: 'publish'
  });

  // ساخت مجموعه‌ها
  const collections = useMemo(() => {
    if (!categories.length || !products.length) return [];

    return categories.map((category) => {
      // پیدا کردن محصولات مربوط به این دسته‌بندی
      const categoryProducts = products.filter((product) => {
        // بررسی categoryId یا category object
        if (product.categories) {
          return product.categories.some(cat => 
            cat.id === category.id || cat.name === category.name
          );
        }
        return product.categoryId === category.id || 
               product.category === category.name ||
               product.category_id === category.id;
      });

      return {
        ...category,
        productCount: categoryProducts.length,
        coverImage: categoryProducts[0]?.images?.[0]?.src || 
                   categoryProducts[0]?.image?.src ||
                   category.image?.src ||
                   category.image ||
                   '/images/placeholder-collection.jpg',
        previewProducts: categoryProducts.slice(0, 3),
        // اگر محصولات دارای تصویر نباشند
        hasProducts: categoryProducts.length > 0,
      };
    });
  }, [categories, products]);

  // فیلتر کردن بر اساس جستجو
  const filteredCollections = useMemo(() => {
    if (!searchTerm.trim()) return collections;
    return collections.filter(collection =>
      collection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections, searchTerm]);

  // وضعیت لودینگ
  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <LoadingSpinner />
        <p className="text-gray-500 text-sm">در حال بارگذاری مجموعه‌ها...</p>
      </div>
    );
  }

  // وضعیت خطا
  if (categoriesError || productsError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-gray-800">خطا در بارگذاری</h3>
        <p className="text-gray-500 text-sm">
          {categoriesError?.message || productsError?.message || 'مشکلی پیش آمده است'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <CollectionHeader total={filteredCollections.length} />
      
      {/* بخش جستجو */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجو در مجموعه‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filteredCollections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCollections.map((collection, index) => (
            <motion.div
              key={collection.id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <CollectionCard collection={collection} />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyCollections searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default Collections;