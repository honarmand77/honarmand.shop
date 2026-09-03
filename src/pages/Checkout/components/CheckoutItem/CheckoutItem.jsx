// src/pages/checkout/components/CheckoutItem.jsx
import { OptimizedImage } from '../../../../components/ui/OptimizedImage/OptimizedImage';

const CheckoutItem = ({ item }) => {
  const image = item.image || '/placeholder-image.jpg';

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        <OptimizedImage
          src={image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
          width={64}
          height={64}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {item.name}
        </p>
        <p className="text-xs text-gray-500">
          تعداد: {item.quantity}
        </p>
      </div>
      <div className="text-left">
        <p className="text-sm font-bold text-primary">
          {(item.price * item.quantity).toLocaleString('fa-IR')}
        </p>
        <span className="text-[10px] text-gray-400">تومان</span>
      </div>
    </div>
  );
};

export default CheckoutItem;