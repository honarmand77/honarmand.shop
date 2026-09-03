// src/components/ui/Select/Select.jsx
import { memo, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../utils/utils';


export const Select = memo(({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'انتخاب کنید...',
  className,
  disabled = false,
  label,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedValue(option.value);
    setIsOpen(false);
    onChange?.(option.value);
  };

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className={cn('relative w-full', className)} ref={selectRef}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors',
          'hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary',
          disabled && 'cursor-not-allowed opacity-50',
          error && 'border-destructive focus:border-destructive focus:ring-destructive'
        )}
        disabled={disabled}
      >
        <span className={selectedValue ? '' : 'text-muted-foreground'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={cn(
          'h-4 w-4 text-muted-foreground transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-card py-1 shadow-lg">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              گزینه‌ای موجود نیست
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted',
                  selectedValue === option.value && 'bg-muted text-primary'
                )}
              >
                <span>{option.label}</span>
                {selectedValue === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;