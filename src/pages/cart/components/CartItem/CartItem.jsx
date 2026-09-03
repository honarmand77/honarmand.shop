// src/pages/cart/components/CartItem.jsx
import { useDispatch } from 'react-redux';
import { Minus, Plus, X } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../../../../features/cart/cartSlice';
import { OptimizedImage } from '../../../../components/ui/OptimizedImage/OptimizedImage';
import { extractImageUrl, isValidImageUrl } from '../../../../utils/extractImage';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
    } else {
      handleRemove();
    }
  };

  const handleIncrement = () => {
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  // استخراج تصویر
  const image = item.image || '/placeholder-image.jpg';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
        <OptimizedImage
          src={image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
          width={112}
          height={112}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
          {item.name}
        </h3>
        <p className="text-lg font-bold text-primary mt-1">
          {item.price.toLocaleString('fa-IR')} تومان
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrement}
          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="کم کردن تعداد"
        >
          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <span className="w-10 text-center font-semibold text-gray-900 dark:text-white">
          {item.quantity}
        </span>
        <button
          onClick={handleIncrement}
          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="افزایش تعداد"
        >
          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center flex-shrink-0"
        aria-label="حذف از سبد خرید"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CartItem;