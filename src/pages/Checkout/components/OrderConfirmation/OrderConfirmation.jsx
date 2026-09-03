// src/pages/checkout/components/OrderConfirmation.jsx
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

const OrderConfirmation = ({ orderNumber = '1001' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          سفارش شما با موفقیت ثبت شد! 🎉
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          سفارش شما با موفقیت ثبت شد و به زودی برای شما ارسال خواهد شد.
        </p>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">شماره سفارش</p>
          <p className="text-xl font-bold text-primary">#{orderNumber}</p>
        </div>

        <div className="space-y-3">
          <Link
            to="/سفارشات"
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            مشاهده سفارشات
          </Link>
          <Link
            to="/"
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;