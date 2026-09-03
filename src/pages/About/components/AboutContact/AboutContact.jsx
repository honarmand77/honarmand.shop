import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutContact = () => {
  const contactInfo = [
    {
      id: 1,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'ایمیل',
      value: 'info@honarmand.shop',
      link: 'mailto:info@honarmand.shop',
    },
    {
      id: 2,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'تلفن',
      value: '+98-9999910764',
      link: 'tel:+989999910764',
    },
    {
      id: 3,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'آدرس',
      value: 'هرمزگان - جزیره قشم - روستای گیاهدان - بلوار اصلی - جنب لوله و اتصالات گلفام',
      link: null,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
        ارتباط با ما
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {contactInfo.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="text-purple-600 flex justify-center mb-3">
              {item.icon}
            </div>
            <p className="text-sm text-gray-500 mb-1">{item.label}</p>
            {item.link ? (
              <a
                href={item.link}
                className="text-gray-800 font-medium hover:text-purple-600 transition-colors"
              >
                {item.value}
              </a>
            ) : (
              <p className="text-gray-800 font-medium">{item.value}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* دکمه تماس با ما */}
      <div className="text-center mt-8">
        <Link
          to="/contactus"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          تماس با ما
        </Link>
      </div>
    </motion.div>
  );
};

export default AboutContact;