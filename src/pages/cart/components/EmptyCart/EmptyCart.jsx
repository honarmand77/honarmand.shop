// src/pages/cart/components/EmptyCart.jsx
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        سبد خرید خالی است
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.
        برای شروع خرید به فروشگاه بروید.
      </p>
      <Link
        to="/فروشگاه"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 font-medium flex items-center gap-2"
      >
        <ShoppingBag className="w-5 h-5" />
        شروع خرید
      </Link>
    </div>
  );
};

export default EmptyCart;