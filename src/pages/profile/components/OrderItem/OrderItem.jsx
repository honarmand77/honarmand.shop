// src/pages/profile/components/OrderItem.jsx
import { Calendar } from 'lucide-react';

const OrderItem = ({ order }) => {
  const statusColors = {
    delivered: 'bg-green-100 text-green-700 border border-green-200',
    processing: 'bg-blue-100 text-blue-700 border border-blue-200',
    pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    cancelled: 'bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <div className="p-5 bg-primary-foreground rounded-lg border border-gray-200/50 hover:border-primary/30 hover:shadow-md transition-all duration-300">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-500">#سفارش:</span>
            <span className="font-mono text-sm font-bold text-primary">#{order.id}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
              {order.status_text}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm text-gray-500">{order.date}</span>
          </div>
        </div>
        <div className="text-left bg-primary/5 px-4 py-2 rounded-xl min-w-[120px]">
          <div className="text-xs text-gray-500">مبلغ کل</div>
          <div className="text-lg font-bold text-primary">
            {order.total.toLocaleString()} 
            <span className="text-xs font-normal text-gray-400 mr-1">تومان</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-gray-200/50">
        {order.items.map((item, index) => (
          <span key={index} className="text-xs px-3 py-1.5 bg-gray-100/50 rounded-lg text-gray-600 border border-gray-200/30">
            {item.name} × {item.quantity}
          </span>
        ))}
      </div>
    </div>
  );
};

export default OrderItem;