// src/pages/checkout/components/CheckoutForm.jsx
import { useState } from 'react';
import { User, Mail, Phone, MapPin, Home, CreditCard, Loader2 } from 'lucide-react';

const CheckoutForm = ({ formData, onChange, onSubmit, isSubmitting }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'نام الزامی است';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'نام خانوادگی الزامی است';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تلفن الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'شماره تلفن معتبر نیست';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'آدرس الزامی است';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'شهر الزامی است';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'کد پستی الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        اطلاعات صورت‌حساب
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            نام
          </label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="نام خود را وارد کنید"
              className={`w-full pr-10 pl-4 py-2.5 rounded-xl border transition-all ${
                errors.firstName
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none`}
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            نام خانوادگی
          </label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="نام خانوادگی خود را وارد کنید"
              className={`w-full pr-10 pl-4 py-2.5 rounded-xl border transition-all ${
                errors.lastName
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none`}
            />
          </div>
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          ایمیل
        </label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ایمیل خود را وارد کنید"
            className={`w-full pr-10 pl-4 py-2.5 rounded-xl border transition-all ${
              errors.email
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
            } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          شماره تلفن
        </label>
        <div className="relative">
          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            className={`w-full pr-10 pl-4 py-2.5 rounded-xl border transition-all ${
              errors.phone
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
            } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none`}
            dir="ltr"
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          آدرس
        </label>
        <div className="relative">
          <Home className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="آدرس کامل خود را وارد کنید"
            className={`w-full pr-10 pl-4 py-2.5 rounded-xl border transition-all ${
              errors.address
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
            } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none`}
          />
        </div>
        {errors.address && (
          <p className="text-xs text-red-500">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            شهر
          </label>
          <div className="relative">
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="شهر خود را وارد کنید"
              className={`w-full pr-10 pl-4 py-2.5 rounded-xl border transition-all ${
                errors.city
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none`}
            />
          </div>
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            کد پستی
          </label>
          <div className="relative">
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="کد پستی را وارد کنید"
              className={`w-full pr-10 pl-4 py-2.5 rounded-xl border transition-all ${
                errors.postalCode
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none`}
              dir="ltr"
            />
          </div>
          {errors.postalCode && (
            <p className="text-xs text-red-500">{errors.postalCode}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          روش پرداخت
        </label>
        <div className="relative">
          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none"
          >
            <option value="cod">پرداخت در محل</option>
            <option value="bank">انتقال بانکی</option>
            <option value="card">کارت اعتباری</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            در حال ثبت سفارش...
          </>
        ) : (
          'ثبت سفارش'
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;