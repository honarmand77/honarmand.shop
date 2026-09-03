// src/components/product/ProductReviews.jsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useRating } from '../../store/hooks/useRating';
import { Rating } from '../../components/ui/Rating/Rating';
import { Star, ThumbsUp, Flag, X, Edit, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { cn } from '../../utils/utils';

// ============================================
// کامپوننت فرم نظر
// ============================================
const ReviewForm = ({ 
  productId, 
  onSuccess, 
  onCancel,
  editData = null,
  isEdit = false,
}) => {
  const { user } = useAuth();
  const { submitReview, updateReview, submitting } = useRating(productId);
  
  const [rating, setRating] = useState(editData?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState(editData?.content || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rating || rating < 1) {
      setError('لطفاً امتیاز خود را مشخص کنید');
      return;
    }

    if (!content.trim() || content.length < 3) {
      setError('لطفاً نظر خود را با حداقل ۳ کاراکتر بنویسید');
      return;
    }

    let result;
    if (isEdit && editData?.id) {
      result = await updateReview(editData.id, content, rating);
    } else {
      result = await submitReview(content, rating);
    }

    if (result) {
      setRating(0);
      setContent('');
      setError('');
      if (onSuccess) onSuccess(result);
    } else {
      setError('خطا در ثبت نظر');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* امتیازدهی */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          امتیاز شما
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
              aria-label={`${star} ستاره`}
            >
              <Star
                size={28}
                className={cn(
                  "transition-colors",
                  star <= (hoverRating || rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300"
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-gray-500 mr-2">
              امتیاز {rating} از 5
            </span>
          )}
        </div>
      </div>

      {/* متن نظر */}
      <div>
        <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-2">
          نظر شما
        </label>
        <textarea
          id="review-content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="نظر خود را درباره این محصول بنویسید..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          required
        />
        <div className="text-xs text-gray-400 mt-1">
          {content.length} کاراکتر
        </div>
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "px-6 py-2 bg-primary text-white rounded-lg font-medium transition-all",
            "hover:bg-primary/90 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {submitting ? 'در حال ارسال...' : isEdit ? 'ویرایش نظر' : 'ارسال نظر'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            انصراف
          </button>
        )}
      </div>
    </form>
  );
};

// ============================================
// کامپوننت آیتم نظر
// ============================================
const ReviewItem = ({ 
  review, 
  productId, 
  onDelete, 
  onReport,
  onEdit,
  isOwner = false,
}) => {
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);

  const handleReport = async () => {
    if (!reportReason.trim()) {
      alert('لطفاً دلیل گزارش را بنویسید');
      return;
    }
    
    setReporting(true);
    const result = await onReport(review.id, reportReason);
    setReporting(false);
    
    if (result) {
      setShowReport(false);
      setReportReason('');
      alert('گزارش شما با موفقیت ارسال شد');
    } else {
      alert('خطا در ارسال گزارش');
    }
  };

  const handleDelete = () => {
    if (window.confirm('آیا از حذف این نظر مطمئن هستید؟')) {
      onDelete(review.id);
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
      {/* هدر */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {review.reviewerAvatar ? (
              <img 
                src={review.reviewerAvatar} 
                alt={review.reviewer}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">
                {review.reviewer}
              </span>
              {review.verified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  خرید تایید شده
                </span>
              )}
              {isOwner && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  نظر شما
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                {review.dateFormatted || format(new Date(review.date), 'dd MMMM yyyy', { locale: faIR })}
              </span>
            </div>
          </div>
        </div>

        {/* عملیات */}
        <div className="flex gap-1">
          {isOwner && (
            <>
              <button
                onClick={() => onEdit(review)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                aria-label="ویرایش"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                aria-label="حذف"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          {!isOwner && (
            <button
              onClick={() => setShowReport(!showReport)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              aria-label="گزارش"
            >
              <Flag size={16} />
            </button>
          )}
        </div>
      </div>

      {/* محتوا */}
      <div className="text-gray-700 text-sm leading-relaxed">
        {review.content}
      </div>

      {/* فرم گزارش */}
      {showReport && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">گزارش نظر</span>
            <button
              onClick={() => setShowReport(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="دلیل گزارش را بنویسید..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={2}
          />
          <button
            onClick={handleReport}
            disabled={reporting}
            className="mt-2 px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {reporting ? 'در حال ارسال...' : 'ارسال گزارش'}
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// کامپوننت اصلی ProductReviews
// ============================================
export const ProductReviews = ({ 
  productId,
  productName = '',
  showForm = true,
  showStatistics = true,
  className = '',
}) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [filter, setFilter] = useState('all'); // all, high, low, with_text
  const [sort, setSort] = useState('latest'); // latest, oldest, highest, lowest

  const {
    reviews,
    rating,
    userRating,
    totalCount,
    loading,
    submitting,
    error,
    averageDisplay,
    hasUserRated,
    loadMore,
    hasMore,
    deleteReview,
    reportReview,
    refresh,
    getDistributionPercentage,
  } = useRating(productId, { perPage: 5, autoLoad: true });

  // ============================================
  // فیلتر و مرتب‌سازی نظرات
  // ============================================
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // فیلتر
    if (filter === 'high') {
      filtered = filtered.filter(r => r.rating >= 4);
    } else if (filter === 'low') {
      filtered = filtered.filter(r => r.rating <= 2);
    } else if (filter === 'with_text') {
      filtered = filtered.filter(r => r.content && r.content.length > 0);
    }

    // مرتب‌سازی
    if (sort === 'latest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === 'highest') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'lowest') {
      filtered.sort((a, b) => a.rating - b.rating);
    }

    return filtered;
  }, [reviews, filter, sort]);

  // ============================================
  // هندلرها
  // ============================================
  const handleReviewSuccess = useCallback(() => {
    setShowReviewForm(false);
    setEditingReview(null);
    refresh();
  }, [refresh]);

  const handleDeleteReview = useCallback(async (reviewId) => {
    const result = await deleteReview(reviewId);
    if (result) {
      refresh();
    }
  }, [deleteReview, refresh]);

  const handleReportReview = useCallback(async (reviewId, reason) => {
    return await reportReview(reviewId, reason);
  }, [reportReview]);

  const handleEditReview = useCallback((review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingReview(null);
    setShowReviewForm(false);
  }, []);

  // ============================================
  // رندر آمار
  // ============================================
  const renderStatistics = useCallback(() => {
    if (!showStatistics) return null;

    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex flex-wrap gap-6 items-center">
          {/* میانگین */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {rating.average.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">از 5</div>
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={star <= Math.round(rating.average) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {totalCount} نظر
              </div>
            </div>
          </div>

          {/* توزیع */}
          <div className="flex-1 min-w-[150px]">
            {[5, 4, 3, 2, 1].map((star) => {
              const percentage = getDistributionPercentage(star);
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-gray-600">{star}</span>
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-gray-500 text-right">
                    {rating.distribution[star] || 0}
                  </span>
                </div>
              );
            })}
          </div>

          {/* امتیاز کاربر */}
          {user && userRating > 0 && (
            <div className="text-center px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-xs text-gray-600">امتیاز شما</div>
              <div className="flex items-center gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= userRating 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [rating, totalCount, user, userRating, showStatistics, getDistributionPercentage]);

  // ============================================
  // رندر
  // ============================================
  return (
    <div className={cn("reviews-container", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          نظرات و امتیازات {productName}
          {totalCount > 0 && (
            <span className="text-sm font-normal text-gray-400 mr-2">
              ({totalCount})
            </span>
          )}
        </h3>
        
        {user && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            ثبت نظر
          </button>
        )}
      </div>

      {/* خطا */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* فرم نظر */}
      {showForm && showReviewForm && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
          <ReviewForm
            productId={productId}
            onSuccess={handleReviewSuccess}
            onCancel={handleCancelEdit}
            editData={editingReview}
            isEdit={!!editingReview}
          />
        </div>
      )}

      {/* آمار */}
      {renderStatistics()}

      {/* فیلتر و مرتب‌سازی */}
      {totalCount > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">همه نظرات</option>
            <option value="high">امتیاز بالا (۴-۵)</option>
            <option value="low">امتیاز پایین (۱-۲)</option>
            <option value="with_text">دارای متن</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="latest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="highest">بالاترین امتیاز</option>
            <option value="lowest">پایین‌ترین امتیاز</option>
          </select>
        </div>
      )}

      {/* لیست نظرات */}
      <div className="space-y-3">
        {loading && reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="text-gray-500 mt-2">در حال بارگذاری نظرات...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {reviews.length > 0 ? 'نظری با این فیلترها یافت نشد' : 'هنوز نظری برای این محصول ثبت نشده است'}
          </div>
        ) : (
          filteredReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              productId={productId}
              onDelete={handleDeleteReview}
              onReport={handleReportReview}
              onEdit={handleEditReview}
              isOwner={user?.display_name === review.reviewer || user?.email === review.reviewer}
            />
          ))
        )}
      </div>

      {/* دکمه بارگذاری بیشتر */}
      {hasMore && !loading && filteredReviews.length > 0 && (
        <button
          onClick={loadMore}
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          نمایش نظرات بیشتر
        </button>
      )}

      {/* بارگذاری بیشتر */}
      {loading && reviews.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;