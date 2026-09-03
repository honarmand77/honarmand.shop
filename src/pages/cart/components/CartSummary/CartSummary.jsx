// src/pages/cart/components/CartSummary.jsx
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { clearCart } from '../../../../features/cart/cartSlice';

const CartSummary = ({ totalItems, totalPrice }) => {
  const dispatch = useDispatch();

  const handleClearCart = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید سبد خرید را خالی کنید؟')) {
      dispatch(clearCart());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        خلاصه سبد خرید
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">تعداد آیتم‌ها</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {totalItems} آیتم
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">جمع قیمت</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {totalPrice.toLocaleString('fa-IR')} تومان
          </span>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="font-bold text-gray-900 dark:text-white">جمع کل</span>
            <span className="text-xl font-bold text-primary">
              {totalPrice.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          to="/پرداخت"
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 font-medium flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          پرداخت
        </Link>

        <button
          onClick={handleClearCart}
          className="w-full py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          خالی کردن سبد
        </button>

        <Link
          to="/فروشگاه"
          className="text-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-1"
        >
          <ShoppingBag className="w-4 h-4" />
          ادامه خرید
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;