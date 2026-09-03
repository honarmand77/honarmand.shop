// src/pages/profile/components/OrdersList.jsx
import { ShoppingBag } from 'lucide-react';
import OrderItem from '../OrderItem/OrderItem';

const OrdersList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 bg-primary-foreground rounded-lg border border-gray-200/50">
        <ShoppingBag className="h-14 w-14 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">هیچ سفارشی ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-lg">سفارشات من</h3>
        <span className="text-sm text-primary font-medium">{orders.length} سفارش</span>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrdersList;