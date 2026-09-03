import React from 'react';
import { motion } from 'framer-motion';

const CollectionHeader = ({ total }) => {
  return (
    <div className="text-center mb-8 sm:mb-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3"
      >
        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          همه مجموعه‌ها
        </span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-500 text-sm sm:text-base"
      >
        {total > 0 ? `${total} مجموعه متنوع برای سلیقه‌های مختلف` : 'در حال بارگذاری...'}
      </motion.p>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mx-auto mt-4"
      />
    </div>
  );
};

export default CollectionHeader;