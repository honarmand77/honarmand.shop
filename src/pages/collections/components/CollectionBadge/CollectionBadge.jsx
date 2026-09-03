import React from 'react';

const CollectionBadge = ({ type, count, label }) => {
  const styles = {
    new: 'bg-green-100 text-green-700',
    popular: 'bg-blue-100 text-blue-700',
    amazing: 'bg-gradient-to-r from-pink-500 to-red-500 text-white',
    default: 'bg-gray-100 text-gray-600',
  };

  const labels = {
    new: 'جدید',
    popular: 'محبوب',
    amazing: 'شگفت‌انگیز',
    default: label || `${count} محصول`,
  };

  const className = styles[type] || styles.default;

  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${className}`}>
      {labels[type] || labels.default}
    </span>
  );
};

export default CollectionBadge;