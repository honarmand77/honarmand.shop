import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AboutHero from './components/AboutHero/AboutHero';
import AboutFeatures from './components/AboutFeatures/AboutFeatures';
import AboutTeam from './components/AboutTeam/AboutTeam';
import AboutStats from './components/AboutStats/AboutStats';
import AboutMission from './components/AboutMission/AboutMission';
import AboutContact from './components/AboutContact/AboutContact';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';

const About = () => {
  useEffect(() => {
    // تغییر عنوان صفحه با متد ساده
    document.title = 'درباره ما | فروشگاه';
    // اسکرول به بالای صفحه
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen">
      {/* هدر صفحه */}
      <AboutHero />

      {/* بخش اصلی */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* محتوای متنی - داستان ما */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10 mb-12 border border-gray-100"
        >
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">📖</span>
              داستان ما
            </h2>
            <p className="mb-4">
              فروشگاه <strong>هنرمند</strong> با هدف ارائه بهترین محصولات با کیفیت و قیمت مناسب 
              به مشتریان عزیز تاسیس شده است. ما معتقدیم که هر خریدی باید تجربه‌ای لذت‌بخش باشد 
              و به همین دلیل همواره تلاش می‌کنیم تا بهترین خدمات را به شما ارائه دهیم.
            </p>
            <p className="mb-4">
              تیم ما متشکل از افراد متخصص و با تجربه در حوزه‌های مختلف است که با عشق و علاقه 
              به کار خود مشغول هستند. ما به <strong>کیفیت</strong>، <strong>صداقت</strong> و 
              <strong> مشتری‌مداری</strong> اعتقاد داریم و این ارزش‌ها را در تمامی فعالیت‌های 
              خود سرلوحه قرار داده‌ایم.
            </p>
            <p>
              در این سال‌ها توانسته‌ایم اعتماد هزاران مشتری را جلب کنیم و با ارائه محصولات متنوع 
              و باکیفیت، جایگاه خود را در بازار تثبیت نماییم. ما به آینده‌ای روشن امیدواریم و 
              با قدرت به مسیر خود ادامه می‌دهیم.
            </p>
          </div>
        </motion.div>

        {/* آمار و ارقام */}
        <AboutStats />

        {/* ویژگی‌ها */}
        <AboutFeatures />

        {/* ماموریت و چشم‌انداز */}
        <AboutMission />

        {/* تیم ما */}
        <AboutTeam />

        {/* ارتباط با ما */}
        <AboutContact />
      </div>
    </div>
  );
};

export default About;