import React from 'react';
import { motion } from 'framer-motion';

const AboutMission = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
    >
      {/* ماموریت */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-600 rounded-lg text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">ماموریت ما</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          ارائه بهترین محصولات با بالاترین کیفیت و قیمت مناسب به مشتریان عزیز، 
          همراه با تجربه خرید لذت‌بخش و خدمات پس از فروش بی‌نظیر.
        </p>
      </div>

      {/* چشم‌انداز */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">چشم‌انداز ما</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          تبدیل شدن به یکی از معتبرترین و محبوب‌ترین فروشگاه‌های آنلاین در کشور، 
          با تکیه بر کیفیت، اعتماد و نوآوری در ارائه خدمات.
        </p>
      </div>
    </motion.div>
  );
};

export default AboutMission;