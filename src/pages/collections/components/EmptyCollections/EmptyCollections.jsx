import React from 'react';

const EmptyCollections = ({ searchTerm = '' }) => {
  return (
    <div className="text-center py-16 sm:py-24">
      <div className="text-6xl mb-4">{searchTerm ? '🔍' : '📦'}</div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        {searchTerm ? 'نتیجه‌ای یافت نشد' : 'هیچ مجموعه‌ای یافت نشد'}
      </h3>
      <p className="text-gray-500 text-sm">
        {searchTerm 
          ? `برای "${searchTerm}" نتیجه‌ای پیدا نشد` 
          : 'به زودی مجموعه‌های جدید اضافه می‌شوند'}
      </p>
      {searchTerm && (
        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-purple-600 hover:text-purple-700 font-medium"
        >
          نمایش همه مجموعه‌ها
        </button>
      )}
    </div>
  );
};

export default EmptyCollections;