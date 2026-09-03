// src/pages/profile/components/WishlistItem.jsx
import { Heart, Package } from 'lucide-react';

const WishlistItem = ({ item, onRemove }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-primary-foreground rounded-lg border border-gray-200/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-7 w-7 text-primary/40" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">{item.name}</h4>
        <p className="text-sm text-primary font-medium">{item.price.toLocaleString()} تومان</p>
      </div>
      <button 
        onClick={() => onRemove && onRemove(item.id)}
        className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
      >
        <Heart className="h-5 w-5 fill-red-400 group-hover:fill-red-500" />
      </button>
    </div>
  );
};

export default WishlistItem;