// src/pages/checkout/components/CheckoutSummary.jsx
import { ShoppingBag, Truck, Clock, Shield } from 'lucide-react';
import CheckoutItem from '../CheckoutItem/CheckoutItem';

const CheckoutSummary = ({ items, totalPrice, totalItems }) => {
  const deliveryCost = 50000;
  const tax = Math.round(totalPrice * 0.09);
  const finalTotal = totalPrice + deliveryCost + tax;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sticky top-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-primary" />
        خلاصه سفارش
      </h3>

      {/* Items */}
      <div className="max-h-60 overflow-y-auto custom-scrollbar mb-4">
        {items.map((item) => (
          <CheckoutItem key={item.id} item={item} />
        ))}
      </div>

      {/* Delivery Info */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
          <Truck className="w-4 h-4 text-primary" />
          <span>ارسال به آدرس شما</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 text-primary" />
          <span>زمان تحویل: ۳ تا ۵ روز کاری</span>
        </div>
      </div>

      {/* Price Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">جمع سبد خرید</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {totalPrice.toLocaleString('fa-IR')} تومان
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">هزینه ارسال</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {deliveryCost.toLocaleString('fa-IR')} تومان
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">مالیات (۹%)</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {tax.toLocaleString('fa-IR')} تومان
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            مبلغ قابل پرداخت
          </span>
          <span className="text-xl font-bold text-primary">
            {finalTotal.toLocaleString('fa-IR')} تومان
          </span>
        </div>
      </div>

      {/* Guarantee */}
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20 flex items-center gap-2">
        <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
        <p className="text-xs text-green-700 dark:text-green-300">
          پرداخت شما امن است. اطلاعات شما محافظت می‌شود.
        </p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default CheckoutSummary;