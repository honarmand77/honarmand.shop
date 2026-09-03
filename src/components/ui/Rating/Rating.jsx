// src/components/Rating/ProductRating.jsx
import React, { useState, useEffect } from 'react';
import { Star, StarHalf, Star as StarOutline } from 'lucide-react';
import { getProductReviews, submitRating } from '../../../services/reviewService';
import { useAuth } from '../../../pages/auth/hooks/useAuth';
import './Rating.css';

export const Rating = ({ productId, productName, onRatingSubmit }) => {
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { isAuthenticated } = useAuth();

  // بارگذاری نظرات و آمار
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductReviews(productId);
      if (response.success) {
        setReviews(response.data.reviews || []);
        setStats({
          average: response.data.average || 0,
          total: response.data.total || 0,
          distribution: response.data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
        setUserRating(response.data.user_rating || 0);
      } else {
        setError('خطا در دریافت نظرات');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // ارسال ریتینگ
  const handleRatingSubmit = async (rating) => {
    if (!isAuthenticated) {
      setError('لطفاً ابتدا وارد حساب کاربری خود شوید');
      return;
    }

    if (rating === userRating) {
      // اگر همان امتیاز قبلی است، حذف می‌کنیم
      setUserRating(0);
      setSuccess('امتیاز شما حذف شد');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await submitRating(productId, rating);
      if (response.success) {
        setUserRating(rating);
        setSuccess('امتیاز شما با موفقیت ثبت شد');
        // به‌روزرسانی آمار
        await fetchReviews();
        if (onRatingSubmit) {
          onRatingSubmit(rating);
        }
      } else {
        setError(response.message || 'خطا در ثبت امتیاز');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  // محاسبه درصد توزیع
  const getPercentage = (count) => {
    if (stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };

  // رندر ستاره‌ها
  const renderStars = (rating, size = 20, interactive = false, onStarClick = null, onStarHover = null) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      let star;
      if (i <= fullStars) {
        star = <Star key={i} size={size} className="star filled" fill="#f59e0b" stroke="#f59e0b" />;
      } else if (i === fullStars + 1 && hasHalfStar) {
        star = <StarHalf key={i} size={size} className="star half" fill="#f59e0b" stroke="#f59e0b" />;
      } else {
        star = <StarOutline key={i} size={size} className="star empty" stroke="#d1d5db" />;
      }

      if (interactive) {
        stars.push(
          <button
            key={i}
            onClick={() => onStarClick && onStarClick(i)}
            onMouseEnter={() => onStarHover && onStarHover(i)}
            onMouseLeave={() => onStarHover && onStarHover(0)}
            className="star-button"
            disabled={submitting}
            aria-label={`امتیاز ${i} از 5`}
          >
            {i <= (hoverRating || rating) ? (
              <Star size={size} className="star filled interactive" fill="#f59e0b" stroke="#f59e0b" />
            ) : (
              <StarOutline size={size} className="star empty interactive" stroke="#d1d5db" />
            )}
          </button>
        );
      } else {
        stars.push(
          <span key={i} className="star-wrapper">
            {star}
          </span>
        );
      }
    }

    return stars;
  };

  // رندر آیتم نظر
  const renderReviewItem = (review) => (
    <div key={review.id} className="review-item">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.reviewer_avatar_urls?.[48] ? (
              <img 
                src={review.reviewer_avatar_urls[48]} 
                alt={review.reviewer}
                className="avatar"
              />
            ) : (
              <div className="avatar-placeholder">
                {review.reviewer?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="reviewer-details">
            <span className="reviewer-name">{review.reviewer || 'کاربر ناشناس'}</span>
            <span className="review-date">
              {review.formatted_date_created || new Date(review.date_created).toLocaleDateString('fa-IR')}
            </span>
          </div>
        </div>
        <div className="review-rating">
          {renderStars(review.rating, 16)}
        </div>
      </div>
      {review.review && (
        <div className="review-content">
          <p>{review.review.replace(/<[^>]*>/g, '')}</p>
        </div>
      )}
      {review.verified && (
        <span className="verified-badge">✓ خرید تایید شده</span>
      )}
    </div>
  );

  if (loading && reviews.length === 0) {
    return (
      <div className="product-rating loading">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری نظرات...</p>
      </div>
    );
  }

  return (
    <div className="product-rating">
      <h3 className="rating-title">نظرات و امتیازات {productName}</h3>
      
      {/* خلاصه امتیازات */}
      <div className="rating-summary">
        <div className="summary-average">
          <span className="average-number">{stats.average.toFixed(1)}</span>
          <div className="average-stars">
            {renderStars(stats.average, 24)}
          </div>
          <span className="total-reviews">({stats.total} نظر)</span>
        </div>

        <div className="summary-distribution">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="distribution-row">
              <span className="star-label">{star}</span>
              <Star size={14} className="star-small" fill="#f59e0b" stroke="#f59e0b" />
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getPercentage(stats.distribution[star] || 0)}%` }}
                ></div>
              </div>
              <span className="count-label">{stats.distribution[star] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* بخش امتیازدهی کاربر */}
      {isAuthenticated && (
        <div className="user-rating-section">
          <p className="user-rating-label">امتیاز شما به این محصول:</p>
          <div className="user-rating-stars">
            {renderStars(
              hoverRating || userRating, 
              28, 
              true, 
              handleRatingSubmit,
              setHoverRating
            )}
          </div>
          {userRating > 0 && (
            <span className="user-rating-text">
              امتیاز شما: {userRating} از 5
            </span>
          )}
          {submitting && <span className="submitting-text">در حال ثبت...</span>}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>
      )}

      {/* لیست نظرات */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">هنوز نظری برای این محصول ثبت نشده است</p>
        ) : (
          reviews.map(renderReviewItem)
        )}
      </div>

      {/* دکمه مشاهده همه نظرات */}
      {reviews.length > 5 && (
        <button className="view-all-reviews">
          مشاهده همه نظرات ({stats.total})
        </button>
      )}
    </div>
  );
};
