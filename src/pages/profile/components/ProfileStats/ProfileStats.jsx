// src/pages/profile/components/ProfileStats.jsx
import { ShoppingBag, Heart, Star, Gift } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-primary-foreground p-4 rounded-lg border border-gray-200/50 hover:border-primary/30 transition-all duration-300">
    <div className="flex items-center gap-3">
      <div className={`p-2.5 rounded-xl bg-${color}-100 text-${color}-600`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const ProfileStats = ({ ordersCount, wishlistCount, rating, discounts }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard icon={ShoppingBag} label="سفارشات" value={ordersCount} color="blue" />
      <StatCard icon={Heart} label="علاقه‌مندی‌ها" value={wishlistCount} color="red" />
      <StatCard icon={Star} label="امتیاز" value={rating || '۴.۸'} color="amber" />
      <StatCard icon={Gift} label="تخفیف‌ها" value={discounts || '۳'} color="green" />
    </div>
  );
};

export default ProfileStats;