// src/components/ui/Card/Card.jsx
import { memo, forwardRef } from 'react';
import { cn } from '../../../utils/utils';



export const Card = memo(
  forwardRef(({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  })
);

Card.displayName = 'Card';

export const CardHeader = memo(
  forwardRef(({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      >
        {children}
      </div>
    );
  })
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = memo(
  forwardRef(({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
      >
        {children}
      </h3>
    );
  })
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = memo(
  forwardRef(({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  })
);

CardDescription.displayName = 'CardDescription';

export const CardContent = memo(
  forwardRef(({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
        {children}
      </div>
    );
  })
);

CardContent.displayName = 'CardContent';

export const CardFooter = memo(
  forwardRef(({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
      >
        {children}
      </div>
    );
  })
);

CardFooter.displayName = 'CardFooter';

export default Card;