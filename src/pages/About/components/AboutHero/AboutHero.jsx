import React from 'react';
import { motion } from 'framer-motion';

const AboutHero = ({ title, description }) => {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* الگوی پس‌زمینه */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1000 1000">
          <circle cx="200" cy="200" r="300" fill="white" />
          <circle cx="800" cy="700" r="250" fill="white" />
          <circle cx="500" cy="500" r="200" fill="white" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            {title || 'درباره ما'}
          </h1>
          <div className="w-24 h-1 bg-white/50 rounded-full mx-auto mb-4" />
          <p className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto">
            {description || 'با ما آشنا شوید و از خدمات ما مطلع گردید'}
          </p>
        </motion.div>

        {/* مسیر راهنما */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-2 text-white/80 text-sm"
        >
          <span>خانه</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white font-medium">درباره ما</span>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutHero;