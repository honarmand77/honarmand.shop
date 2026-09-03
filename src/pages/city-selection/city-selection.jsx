// src/pages/city-selection/city-selection.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Check, 
  X, 
  ArrowLeft,
  Navigation,
  Star,
  Clock,
  TrendingUp,
  Shield,
  Truck,
  CreditCard
} from 'lucide-react';
import Navbar from '../../components/common/Navbar/navbar';

const cities = [
  { name: 'تهران', province: 'تهران', population: 'بیش از ۸ میلیون', isPopular: true },
  { name: 'مشهد', province: 'خراسان رضوی', population: 'بیش از ۳ میلیون', isPopular: true },
  { name: 'اصفهان', province: 'اصفهان', population: 'بیش از ۲ میلیون', isPopular: true },
  { name: 'شیراز', province: 'فارس', population: 'بیش از ۱.۵ میلیون', isPopular: true },
  { name: 'تبریز', province: 'آذربایجان شرقی', population: 'بیش از ۱.۵ میلیون', isPopular: true },
  { name: 'کرج', province: 'البرز', population: 'بیش از ۱.۵ میلیون', isPopular: true },
  { name: 'قم', province: 'قم', population: 'بیش از ۱ میلیون', isPopular: true },
  { name: 'اهواز', province: 'خوزستان', population: 'بیش از ۱ میلیون', isPopular: true },
  { name: 'رشت', province: 'گیلان', population: 'بیش از ۷۰۰ هزار', isPopular: false },
  { name: 'کرمانشاه', province: 'کرمانشاه', population: 'بیش از ۹۰۰ هزار', isPopular: false },
  { name: 'ارومیه', province: 'آذربایجان غربی', population: 'بیش از ۷۰۰ هزار', isPopular: false },
  { name: 'زاهدان', province: 'سیستان و بلوچستان', population: 'بیش از ۶۰۰ هزار', isPopular: false },
  { name: 'همدان', province: 'همدان', population: 'بیش از ۵۰۰ هزار', isPopular: false },
  { name: 'کرمان', province: 'کرمان', population: 'بیش از ۵۰۰ هزار', isPopular: false },
  { name: 'یزد', province: 'یزد', population: 'بیش از ۵۰۰ هزار', isPopular: false },
  { name: 'اردبیل', province: 'اردبیل', population: 'بیش از ۵۰۰ هزار', isPopular: false },
  { name: 'بندرعباس', province: 'هرمزگان', population: 'بیش از ۵۰۰ هزار', isPopular: false },
  { name: 'اسلام‌شهر', province: 'تهران', population: 'بیش از ۵۰۰ هزار', isPopular: false },
  { name: 'قزوین', province: 'قزوین', population: 'بیش از ۴۰۰ هزار', isPopular: false },
  { name: 'زنجان', province: 'زنجان', population: 'بیش از ۴۰۰ هزار', isPopular: false },
  { name: 'خرم‌آباد', province: 'لرستان', population: 'بیش از ۴۰۰ هزار', isPopular: false },
  { name: 'سنندج', province: 'کردستان', population: 'بیش از ۴۰۰ هزار', isPopular: false },
  { name: 'گرگان', province: 'گلستان', population: 'بیش از ۳۵۰ هزار', isPopular: false },
  { name: 'ساری', province: 'مازندران', population: 'بیش از ۳۵۰ هزار', isPopular: false },
  { name: 'ملارد', province: 'تهران', population: 'بیش از ۳۰۰ هزار', isPopular: false },
  { name: 'بابل', province: 'مازندران', population: 'بیش از ۳۰۰ هزار', isPopular: false },
  { name: 'کاشان', province: 'اصفهان', population: 'بیش از ۳۰۰ هزار', isPopular: false },
  { name: 'آمل', province: 'مازندران', population: 'بیش از ۳۰۰ هزار', isPopular: false },
  { name: 'نیشابور', province: 'خراسان رضوی', population: 'بیش از ۳۰۰ هزار', isPopular: false },
  { name: 'بجنورد', province: 'خراسان شمالی', population: 'بیش از ۲۰۰ هزار', isPopular: false },
];

// شهرهای محبوب برای نمایش سریع
const popularCities = cities.filter(city => city.isPopular).slice(0, 6);

const CitySelection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentCities, setRecentCities] = useState([]);
  const [showAllCities, setShowAllCities] = useState(false);

  // بارگذاری شهر ذخیره شده
  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      setSelectedCity(savedCity);
    }

    const recent = JSON.parse(localStorage.getItem('recentCities') || '[]');
    setRecentCities(recent.slice(0, 5));
  }, []);

  // فیلتر کردن شهرها
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return cities;
    const term = searchTerm.trim();
    return cities.filter(city => 
      city.name.includes(term) || 
      city.province.includes(term)
    );
  }, [searchTerm]);

  // گروه‌بندی شهرها بر اساس حرف اول
  const groupedCities = useMemo(() => {
    const groups = {};
    filteredCities.forEach(city => {
      const firstChar = city.name[0];
      if (!groups[firstChar]) groups[firstChar] = [];
      groups[firstChar].push(city);
    });
    return groups;
  }, [filteredCities]);

  const handleSelectCity = useCallback((city) => {
    setSelectedCity(city.name);
    localStorage.setItem('selectedCity', city.name);
    
    // به‌روزرسانی شهرهای اخیر
    const recent = JSON.parse(localStorage.getItem('recentCities') || '[]');
    const updatedRecent = [city.name, ...recent.filter(c => c !== city.name)].slice(0, 5);
    localStorage.setItem('recentCities', JSON.stringify(updatedRecent));
    setRecentCities(updatedRecent);

    // ارسال رویداد
    window.dispatchEvent(new CustomEvent('cityChanged', { 
      detail: { city: city.name } 
    }));

    setIsOpen(false);
    navigate(-1);
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // محاسبه تعداد نتایج
  const resultCount = filteredCities.length;

  return (
    <div className="min-h-screen ">
    <Navbar/>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              انتخاب شهر
            </h1>
            <p className="text-sm mt-1">
              شهر خود را برای دریافت خدمات انتخاب کنید
            </p>
          </div>
          <div className="w-10" />
        </div>

        {/* Search Box */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="جستجوی شهر یا استان..."
              className="w-full pr-12 pl-12 py-3.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* Search Stats */}
          {searchTerm && (
            <div className="mt-2 text-sm">
              {resultCount} شهر پیدا شد
            </div>
          )}
        </div>

        {/* Selected City Badge */}
        {selectedCity && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border-2 border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">شهر انتخابی شما</p>
                <p className="font-bold text-lg text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {selectedCity}
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('selectedCity');
                  setSelectedCity('');
                  window.dispatchEvent(new CustomEvent('cityChanged', { detail: { city: null } }));
                }}
                className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                تغییر
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  () => {
                    // در حالت واقعی، موقعیت مکانی را به شهر تبدیل می‌کنیم
                    alert('موقعیت مکانی شما دریافت شد..');
                  },
                  () => {
                    alert('امکان دریافت موقعیت مکانی وجود ندارد. لطفاً شهر خود را دستی انتخاب کنید.');
                  }
                );
              }
            }}
            className="flex flex-col items-center gap-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border-2 border-blue-100 dark:border-blue-800"
          >
            <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-gray-700 dark:text-gray-300">موقعیت من</span>
          </button>
          <button
            onClick={() => setShowAllCities(!showAllCities)}
            className="flex flex-col items-center gap-1 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-2 border-purple-100 dark:border-purple-800"
          >
            <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {showAllCities ? 'نمایش کمتر' : 'همه شهرها'}
            </span>
          </button>
          <button
            onClick={() => handleSelectCity({ name: 'تهران' })}
            className="flex flex-col items-center gap-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors border-2 border-green-100 dark:border-green-800"
          >
            <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-xs text-gray-700 dark:text-gray-300">پربازدید</span>
          </button>
        </div>

        {/* Recent Cities */}
        {recentCities.length > 0 && !searchTerm && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              شهرهای اخیر
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentCities.map(city => (
                <button
                  key={city}
                  onClick={() => {
                    const foundCity = cities.find(c => c.name === city);
                    if (foundCity) handleSelectCity(foundCity);
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-gray-500 flex items-center gap-2"
                >
                  <MapPin className="w-3 h-3" />
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Cities */}
        {!searchTerm && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              شهرهای محبوب
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {popularCities.map(city => (
                <button
                  key={city.name}
                  onClick={() => handleSelectCity(city)}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all duration-300 text-right
                        flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                        ${selectedCity === city.name
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-white'
                          : 'border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900'
                        }
                      `}
                >
                  <div className="font-medium text-sm">
                    {city.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {city.province}
                  </div>
                  {selectedCity === city.name && (
                    <Check className="absolute top-2 left-2 w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Cities List */}
        {(showAllCities || searchTerm) && (
          <div className=" backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 max-h-[400px] overflow-y-auto">
            {Object.entries(groupedCities).map(([letter, cities]) => (
              <div key={letter} className="mb-4 last:mb-0">
                <div className="sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-2 px-3 rounded-lg mb-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                    {letter}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {cities.map(city => (
                    <button
                      key={city.name}
                      onClick={() => handleSelectCity(city)}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                        ${selectedCity === city.name
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-white'
                          : 'border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900'
                        }
                      `}
                    >
                      <div className="flex-1 text-right">
                        <div className="font-medium  text-sm">
                          {city.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {city.province}
                        </div>
                      </div>
                      {selectedCity === city.name && (
                        <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
            <Shield className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">امنیت بالا</p>
          </div>
          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
            <Truck className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">ارسال سریع</p>
          </div>
          <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
            <CreditCard className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">پرداخت آسان</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            با انتخاب شهر، بهترین تجربه خرید را داشته باشید
          </p>
        </div>
      </div>
    </div>
  );
};

export default CitySelection;