// src/pages/product/components/ProductMeta.jsx
import { useState } from 'react';
import { 
  Info, 
  FileText, 
  Star, 
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Tag,
  Package,
  Truck,
  Shield,
  RefreshCw
} from 'lucide-react';

const ProductMeta = ({ product, reviews = [], rating = { average: 0, count: 0 } }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'توضیحات', icon: Info },
    { id: 'specifications', label: 'مشخصات', icon: FileText },
    { id: 'reviews', label: 'نظرات', icon: MessageCircle, count: reviews.length },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                توضیحاتی برای این محصول ثبت نشده است.
              </p>
            )}
          </div>
        );

      case 'specifications':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Tag className="w-4 h-4" />
                  <span>دسته‌بندی</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {product.categories?.map(cat => cat.name).join('، ') || '—'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Package className="w-4 h-4" />
                  <span>کد محصول</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {product.sku || product.id || '—'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Truck className="w-4 h-4" />
                  <span>موجودی</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {product.is_in_stock ? 'موجود' : 'ناموجود'}
                  {product.stock_quantity && ` (${product.stock_quantity} عدد)`}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>تاریخ بروزرسانی</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {product.updated_at 
                    ? new Date(product.updated_at).toLocaleDateString('fa-IR')
                    : '—'
                  }
                </p>
              </div>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {rating.average?.toFixed(1) || '۰'}
                </div>
                <div className="flex items-center gap-1 justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(rating.average || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {rating.count || 0} نظر
                </p>
              </div>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {review.reviewer || 'کاربر'}
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < (review.rating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {review.date || 'تاریخ نامشخص'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {review.content && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {review.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">هنوز نظری برای این محصول ثبت نشده است</p>
                <button className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition">
                  ثبت اولین نظر
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductMeta;