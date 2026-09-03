// src/components/ui/Input/Input.jsx
import { memo, forwardRef } from 'react';
import { cn } from '../../../utils/utils';

export const Input = memo(
  forwardRef(({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  })
);

Input.displayName = 'Input';

export default Input;