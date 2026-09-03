import React from 'react';
import { motion } from 'framer-motion';

const AboutTeam = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'احمد رضایی',
      role: 'مدیرعامل و بنیان‌گذار',
      image: 'https://ui-avatars.com/api/?name=احمد+رضایی&size=100&background=6C5CE7&color=fff',
      bio: 'با بیش از ۱۰ سال تجربه در حوزه کسب‌وکار و مدیریت',
    },
    {
      id: 2,
      name: 'سارا محمدی',
      role: 'مدیر بازاریابی',
      image: 'https://ui-avatars.com/api/?name=سارا+محمدی&size=100&background=FD79A8&color=fff',
      bio: 'کارشناس ارشد مدیریت بازاریابی با سابقه درخشان',
    },
    {
      id: 3,
      name: 'علی کریمی',
      role: 'مدیر فنی',
      image: 'https://ui-avatars.com/api/?name=علی+کریمی&size=100&background=00CEC9&color=fff',
      bio: 'متخصص در حوزه فناوری اطلاعات و توسعه نرم‌افزار',
    },
    {
      id: 4,
      name: 'مریم حسینی',
      role: 'مدیر پشتیبانی',
      image: 'https://ui-avatars.com/api/?name=مریم+حسینی&size=100&background=FDCB6E&color=fff',
      bio: 'با تمرکز بر رضایت مشتری و بهبود تجربه کاربری',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
        تیم ما
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100 hover:shadow-md transition-shadow"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-100"
            />
            <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
            <p className="text-sm text-purple-600 font-medium mb-2">{member.role}</p>
            <p className="text-sm text-gray-500">{member.bio}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutTeam;