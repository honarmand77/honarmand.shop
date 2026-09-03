// src/components/common/Filters/Filters.jsx
import React, { useState } from 'react';
import { Filter, X, ChevronDown, Search } from 'lucide-react';

const Filters = ({
  // ============================================
  // Category Props
  // ============================================
  categories = [],
  selectedCategory = 'all',
  onCategoryChange,
  
  // ============================================
  // Sort Props
  // ============================================
  sortBy = 'popular',
  onSortChange,
  sortOptions = [],
  
  // ============================================
  // Search Props
  // ============================================
  searchTerm = '',
  onSearchChange,
  onClearSearch,
  placeholder = 'جستجوی محصول...',
  
  // ============================================
  // Price Range Props
  // ============================================
  priceRange = 'all',
  onPriceRangeChange,
  priceOptions = [],
  
  // ============================================
  // Stock Status Props
  // ============================================
  stockStatus = 'all',
  onStockStatusChange,
  
  // ============================================
  // Rating Props
  // ============================================
  minRating = '0',
  onMinRatingChange,
  
  // ============================================
  // Discount Props
  // ============================================
  minDiscount = '0',
  onMinDiscountChange,
  
  // ============================================
  // Checkbox Props
  // ============================================
  onSale = false,
  onOnSaleChange,
  inStock = false,
  onInStockChange,
  
  // ============================================
  // UI Controls
  // ============================================
  showAdvancedFilters = false,
  onToggleAdvancedFilters,
  showMobileFilters = false,
  onToggleMobileFilters,
  
  // ============================================
  // Actions
  // ============================================
  onClearFilters,
  applyFilters,
  
  // ============================================
  // Styling
  // ============================================
  colorScheme = 'pink',
  isFilterActive = false,
  className = '',
}) => {
  // ============================================
  // Color Scheme Mapping
  // ============================================
  const colors = {
    pink: {
      primary: 'pink',
      bg: 'bg-pink-50 dark:bg-pink-900/30',
      text: 'text-pink-700 dark:text-pink-300',
      border: 'border-pink-100 dark:border-pink-800/50',
      ring: 'ring-pink-500/40',
      hover: 'hover:bg-pink-100 dark:hover:bg-pink-800/50',
      active: 'bg-pink-500 text-white hover:bg-pink-600',
      badge: 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-100 dark:border-pink-800/50',
      button: 'bg-pink-500 hover:bg-pink-600',
      shadow: 'shadow-pink-500/30',
    },
    orange: {
      primary: 'orange',
      bg: 'bg-orange-50 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-100 dark:border-orange-800/50',
      ring: 'ring-orange-500/40',
      hover: 'hover:bg-orange-100 dark:hover:bg-orange-800/50',
      active: 'bg-orange-500 text-white hover:bg-orange-600',
      badge: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-800/50',
      button: 'bg-orange-500 hover:bg-orange-600',
      shadow: 'shadow-orange-500/30',
    },
    blue: {
      primary: 'blue',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-100 dark:border-blue-800/50',
      ring: 'ring-blue-500/40',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-800/50',
      active: 'bg-blue-500 text-white hover:bg-blue-600',
      badge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800/50',
      button: 'bg-blue-500 hover:bg-blue-600',
      shadow: 'shadow-blue-500/30',
    },
    purple: {
      primary: 'purple',
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-100 dark:border-purple-800/50',
      ring: 'ring-purple-500/40',
      hover: 'hover:bg-purple-100 dark:hover:bg-purple-800/50',
      active: 'bg-purple-500 text-white hover:bg-purple-600',
      badge: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800/50',
      button: 'bg-purple-500 hover:bg-purple-600',
      shadow: 'shadow-purple-500/30',
    },
    green: {
      primary: 'green',
      bg: 'bg-green-50 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-100 dark:border-green-800/50',
      ring: 'ring-green-500/40',
      hover: 'hover:bg-green-100 dark:hover:bg-green-800/50',
      active: 'bg-green-500 text-white hover:bg-green-600',
      badge: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800/50',
      button: 'bg-green-500 hover:bg-green-600',
      shadow: 'shadow-green-500/30',
    },
  };

  const c = colors[colorScheme] || colors.pink;

  // ============================================
  // Default Options
  // ============================================
  const defaultSortOptions = [
    { value: 'discount', label: '🎯 بیشترین تخفیف' },
    { value: 'popular', label: '🔥 محبوب‌ترین' },
    { value: 'newest', label: '✨ جدیدترین' },
    { value: 'price-asc', label: '💰 ارزان‌ترین' },
    { value: 'price-desc', label: '💎 گران‌ترین' },
    { value: 'best-selling', label: '🏆 پرفروش‌ترین' },
    { value: 'rating', label: '⭐ بالاترین امتیاز' },
  ];

  const defaultPriceOptions = [
    { value: 'all', label: '💰 همه قیمت‌ها' },
    { value: '0-100', label: 'تا ۱۰۰ هزار تومان' },
    { value: '100-500', label: '۱۰۰ تا ۵۰۰ هزار' },
    { value: '500-1000', label: '۵۰۰ تا ۱ میلیون' },
    { value: '1000-5000', label: '۱ تا ۵ میلیون' },
    { value: '5000+', label: 'بیش از ۵ میلیون' },
  ];

  const finalSortOptions = sortOptions.length > 0 ? sortOptions : defaultSortOptions;
  const finalPriceOptions = priceOptions.length > 0 ? priceOptions : defaultPriceOptions;

  // ============================================
  // Check if any filter is active
  // ============================================
  const hasActiveFilters = 
    selectedCategory !== 'all' ||
    searchTerm ||
    priceRange !== 'all' ||
    stockStatus !== 'all' ||
    minRating !== '0' ||
    minDiscount !== '0' ||
    onSale ||
    inStock;

  // ============================================
  // Render Active Filters Tags
  // ============================================
  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (selectedCategory !== 'all') {
      const category = categories.find(c => String(c.id) === String(selectedCategory));
      activeFilters.push({
        label: category?.name || selectedCategory,
        onRemove: () => onCategoryChange('all'),
      });
    }
    
    if (searchTerm) {
      activeFilters.push({
        label: `"${searchTerm}"`,
        onRemove: onClearSearch,
      });
    }
    
    if (priceRange !== 'all') {
      const option = finalPriceOptions.find(o => o.value === priceRange);
      const label = option?.label?.replace('💰 ', '') || priceRange;
      activeFilters.push({
        label: label,
        onRemove: () => onPriceRangeChange('all'),
      });
    }
    
    if (stockStatus !== 'all') {
      const labels = { 
        instock: '✅ موجود', 
        outofstock: '❌ ناموجود', 
        onbackorder: '⏳ در راه' 
      };
      activeFilters.push({
        label: labels[stockStatus] || stockStatus,
        onRemove: () => onStockStatusChange('all'),
      });
    }
    
    if (minRating !== '0') {
      activeFilters.push({
        label: `⭐ ${minRating}+`,
        onRemove: () => onMinRatingChange('0'),
      });
    }
    
    if (minDiscount !== '0') {
      activeFilters.push({
        label: `${minDiscount}%+ تخفیف`,
        onRemove: () => onMinDiscountChange('0'),
      });
    }
    
    if (onSale) {
      activeFilters.push({
        label: '🔥 تخفیف‌دار',
        onRemove: () => onOnSaleChange(false),
      });
    }
    
    if (inStock) {
      activeFilters.push({
        label: '✅ موجودی فوری',
        onRemove: () => onInStockChange(false),
      });
    }
    
    if (activeFilters.length === 0) return null;
    
    return (
      <div className="flex items-center gap-2 flex-wrap w-full pt-2">
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">فیلترهای فعال:</span>
        {activeFilters.map((filter, index) => (
          <span
            key={index}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${c.badge} rounded-xl text-xs font-medium border ${c.border} animate-fadeIn`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-${c.primary}-500`} />
            {filter.label}
            <button
              onClick={filter.onRemove}
              className={`${c.hover} rounded-full p-0.5 transition-all duration-200 hover:scale-110`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <button
          onClick={onClearFilters}
          className={`text-xs ${c.text} font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1 px-2 py-1 rounded-lg ${c.hover}`}
        >
          <X className="w-3.5 h-3.5" />
          حذف همه
        </button>
      </div>
    );
  };

  // ============================================
  // Main Render
  // ============================================
  return (
    <div className={`py-4 w-full ${className}`}>
      <div className="rounded-lg transition-all duration-300">
        
        {/* ============================================ */}
        {/* Desktop Filters */}
        {/* ============================================ */}
        <div className="hidden lg:flex md:flex flex-wrap items-center gap-3">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              className={`w-full pr-10 pl-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500`}
            />
            {searchTerm && (
              <button
                onClick={onClearSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category */}
          <div className="relative flex-1 min-w-[160px] max-w-[220px]">
            <select
              value={selectedCategory}
              onChange={(e) => {
                if (onCategoryChange) onCategoryChange(e.target.value);
              }}
              className="w-full appearance-none pr-4 pl-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 cursor-pointer text-sm text-gray-700 dark:text-gray-200 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
            >
              <option value="all">📂 همه دسته‌بندی‌ها</option>
              {categories && categories.length > 0 ? (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="all" disabled>دسته‌بندی موجود نیست</option>
              )}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative flex-1 min-w-[140px] max-w-[180px]">
            <select
              value={sortBy}
              onChange={(e) => {
                if (onSortChange) onSortChange(e.target.value);
              }}
              className="w-full appearance-none pr-4 pl-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 cursor-pointer text-sm text-gray-700 dark:text-gray-200 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
            >
              {finalSortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Price Range */}
          <div className="relative flex-1 min-w-[140px] max-w-[180px]">
            <select
              value={priceRange}
              onChange={(e) => {
                if (onPriceRangeChange) onPriceRangeChange(e.target.value);
              }}
              className="w-full appearance-none pr-4 pl-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 cursor-pointer text-sm text-gray-700 dark:text-gray-200 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
            >
              {finalPriceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={onToggleAdvancedFilters}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              showAdvancedFilters 
                ? `${c.active}` 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            {showAdvancedFilters ? 'بستن فیلترها' : 'فیلترهای پیشرفته'}
            {!showAdvancedFilters && hasActiveFilters && (
              <span className={`text-xs ${c.badge} px-2 py-0.5 rounded-full`}>
                فعال
              </span>
            )}
          </button>

          {/* Active Filters */}
          {renderActiveFilters()}
        </div>

        {/* ============================================ */}
        {/* Advanced Filters */}
        {/* ============================================ */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-slideDown">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Stock Status */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  وضعیت موجودی
                </label>
                <select
                  value={stockStatus}
                  onChange={(e) => {
                    if (onStockStatusChange) onStockStatusChange(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 text-sm text-gray-700 dark:text-gray-200 transition-all duration-200"
                >
                  <option value="all">همه</option>
                  <option value="instock">✅ موجود</option>
                  <option value="outofstock">❌ ناموجود</option>
                  <option value="onbackorder">⏳ در راه</option>
                </select>
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  حداقل امتیاز
                </label>
                <select
                  value={minRating}
                  onChange={(e) => {
                    if (onMinRatingChange) onMinRatingChange(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 text-sm text-gray-700 dark:text-gray-200 transition-all duration-200"
                >
                  <option value="0">⭐ همه</option>
                  <option value="1">⭐ ۱+</option>
                  <option value="2">⭐ ۲+</option>
                  <option value="3">⭐ ۳+</option>
                  <option value="4">⭐ ۴+</option>
                  <option value="5">⭐ ۵</option>
                </select>
              </div>

              {/* Min Discount */}
              {onMinDiscountChange && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    حداقل تخفیف
                  </label>
                  <select
                    value={minDiscount}
                    onChange={(e) => {
                      if (onMinDiscountChange) onMinDiscountChange(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 text-sm text-gray-700 dark:text-gray-200 transition-all duration-200"
                  >
                    <option value="0">همه</option>
                    <option value="10">۱۰%+</option>
                    <option value="20">۲۰%+</option>
                    <option value="30">۳۰%+</option>
                    <option value="40">۴۰%+</option>
                    <option value="50">۵۰%+</option>
                    <option value="70">۷۰%+</option>
                  </select>
                </div>
              )}

              {/* Checkboxes */}
              <div className="flex flex-col gap-2 justify-center">
                {onOnSaleChange && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onSale}
                      onChange={(e) => {
                        if (onOnSaleChange) onOnSaleChange(e.target.checked);
                      }}
                      className={`w-4 h-4 text-${c.primary}-500 border-gray-300 rounded focus:ring-${c.primary}-500`}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">🔥 فقط تخفیف‌دار</span>
                  </label>
                )}
                
                {onInStockChange && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => {
                        if (onInStockChange) onInStockChange(e.target.checked);
                      }}
                      className={`w-4 h-4 text-${c.primary}-500 border-gray-300 rounded focus:ring-${c.primary}-500`}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">✅ فقط موجود</span>
                  </label>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={onClearFilters}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                حذف همه فیلترها
              </button>
              <button
                onClick={applyFilters}
                className={`px-6 py-2 ${c.button} text-white rounded-xl transition-all duration-200 text-sm font-medium hover:scale-105 active:scale-95`}
              >
                اعمال فیلترها
              </button>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* Mobile Filters */}
        {/* ============================================ */}
        <div className="lg:hidden md:hidden space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                className={`w-full pr-10 pl-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
              />
            </div>
            <button
              onClick={onToggleMobileFilters}
              className={`p-2.5 ${c.bg} ${c.text} rounded-xl ${c.hover} transition-colors`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {showMobileFilters && (
            <div className={`${c.bg} rounded-xl p-4 space-y-3 animate-slideDown`}>
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  دسته‌بندی
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    if (onCategoryChange) onCategoryChange(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 text-sm text-gray-700 dark:text-gray-200"
                >
                  <option value="all">همه دسته‌بندی‌ها</option>
                  {categories && categories.length > 0 ? (
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="all" disabled>دسته‌بندی موجود نیست</option>
                  )}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  مرتب‌سازی
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    if (onSortChange) onSortChange(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 text-sm text-gray-700 dark:text-gray-200"
                >
                  {finalSortOptions.slice(0, 4).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  محدوده قیمت
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => {
                    if (onPriceRangeChange) onPriceRangeChange(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 ${c.ring} focus:border-${c.primary}-500 text-sm text-gray-700 dark:text-gray-200"
                >
                  {finalPriceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Checkboxes */}
              <div className="flex flex-wrap gap-3 pt-2">
                {onOnSaleChange && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onSale}
                      onChange={(e) => {
                        if (onOnSaleChange) onOnSaleChange(e.target.checked);
                      }}
                      className={`w-4 h-4 text-${c.primary}-500 border-gray-300 rounded focus:ring-${c.primary}-500`}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">🔥 تخفیف</span>
                  </label>
                )}
                {onInStockChange && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => {
                        if (onInStockChange) onInStockChange(e.target.checked);
                      }}
                      className={`w-4 h-4 text-${c.primary}-500 border-gray-300 rounded focus:ring-${c.primary}-500`}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">✅ موجود</span>
                  </label>
                )}
              </div>

              <button
                onClick={onClearFilters}
                className={`w-full py-2.5 ${c.bg} ${c.text} rounded-xl ${c.hover} transition-all duration-200 text-sm font-medium`}
              >
                حذف همه فیلترها
              </button>
            </div>
          )}

          {/* Mobile Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {selectedCategory !== 'all' && categories && categories.length > 0 && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${c.badge} rounded-lg text-[10px] font-medium`}>
                  {categories.find(c => String(c.id) === String(selectedCategory))?.name}
                </span>
              )}
              {searchTerm && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${c.badge} rounded-lg text-[10px] font-medium`}>
                  "{searchTerm}"
                </span>
              )}
              {priceRange !== 'all' && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${c.badge} rounded-lg text-[10px] font-medium`}>
                  {priceRange === '0-100' && 'تا ۱۰۰ هزار'}
                  {priceRange === '100-500' && '۱۰۰ تا ۵۰۰ هزار'}
                  {priceRange === '500-1000' && '۵۰۰ تا ۱ میلیون'}
                  {priceRange === '1000-5000' && '۱ تا ۵ میلیون'}
                  {priceRange === '5000+' && 'بیش از ۵ میلیون'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* Styles */}
      {/* ============================================ */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Filters;