// src/components/ui/Rating/Rating.jsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../../utils/utils';

export const Rating = ({ 
  value = 0, 
  max = 5, 
  onChange, 
  readonly = false,
  size = 'md',
  className,
  showLabel = false,
  productId = null,
  showRatingStats = false,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeMap = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  const starSize = sizeMap[size] || sizeMap.md;

  const handleMouseEnter = (index) => {
    if (!readonly) {
      setHoverValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const handleClick = (index) => {
    if (!readonly && onChange) {
      onChange(index + 1);
    }
  };

  const displayValue = readonly ? value : (hoverValue || value);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          className={cn(
            starSize,
            'cursor-pointer transition-colors',
            index < displayValue 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-muted text-muted-foreground',
            readonly && 'cursor-default',
            !readonly && 'hover:scale-110'
          )}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        />
      ))}
      {showLabel && (
        <span className="mr-2 text-sm text-muted-foreground">
          ({displayValue}/{max})
        </span>
      )}
      {showRatingStats && productId && (
        <span className="mr-2 text-xs text-muted-foreground">
          ({value > 0 ? 'امتیاز' : 'بدون امتیاز'})
        </span>
      )}
    </div>
  );
};

Rating.displayName = 'Rating';

export default Rating;