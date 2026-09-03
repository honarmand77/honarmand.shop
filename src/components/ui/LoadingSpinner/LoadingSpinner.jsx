// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;