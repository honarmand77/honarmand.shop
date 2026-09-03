// src/pages/profile/components/WishlistList.jsx
import { Heart } from 'lucide-react';
import WishlistItem from '../WishlistItem/WishlistItem';

const WishlistList = ({ items, onRemove }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 bg-primary-foreground rounded-lg border border-gray-200/50">
        <Heart className="h-14 w-14 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">هیچ محصولی در علاقه‌مندی‌ها نیست</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-lg">علاقه‌مندی‌ها</h3>
        <span className="text-sm text-primary font-medium">{items.length} مورد</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <WishlistItem key={item.id} item={item} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};

export default WishlistList;