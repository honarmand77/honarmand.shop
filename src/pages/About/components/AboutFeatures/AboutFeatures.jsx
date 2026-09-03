import React from 'react';
import { motion } from 'framer-motion';

const AboutFeatures = () => {
  const features = [
    {
      id: 1,
      title: 'کیفیت برتر',
      description: 'محصولات ما با بالاترین استانداردهای کیفیت تولید و عرضه می‌شوند.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-500 bg-green-50',
    },
    {
      id: 2,
      title: 'قیمت مناسب',
      description: 'بهترین قیمت‌ها را با تضمین کیفیت به شما ارائه می‌دهیم.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-blue-500 bg-blue-50',
    },
    {
      id: 3,
      title: 'پشتیبانی ۲۴/۷',
      description: 'تیم پشتیبانی ما همواره آماده پاسخگویی به سوالات شماست.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 01-7.072 0m0 0L4 18.364m0 0L2 21M8.464 15.536a5 5 0 010-7.072m0 0L11.293 9.5" />
        </svg>
      ),
      color: 'text-purple-500 bg-purple-50',
    },
    {
      id: 4,
      title: 'ارسال سریع',
      description: 'محصولات شما در سریع‌ترین زمان ممکن به دستتان می‌رسد.',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'text-orange-500 bg-orange-50',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
        چرا ما را انتخاب کنید؟
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-3 rounded-full ${feature.color} mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutFeatures;