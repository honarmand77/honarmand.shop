// src/components/ui/Tabs/Tabs.jsx
import { memo, useState, createContext, useContext } from 'react';
import { cn } from '../../../utils/utils';


const TabsContext = createContext();

export const Tabs = memo(({ 
  defaultValue, 
  value: controlledValue, 
  onValueChange, 
  className, 
  children 
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const setValue = (newValue) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

Tabs.displayName = 'Tabs';

export const TabsList = memo(({ className, children }) => {
  return (
    <div className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}>
      {children}
    </div>
  );
});

TabsList.displayName = 'TabsList';

export const TabsTrigger = memo(({ className, value, children }) => {
  const context = useContext(TabsContext);
  const isActive = context.value === value;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
        isActive 
          ? 'bg-background text-foreground shadow-sm' 
          : 'hover:bg-background/50 hover:text-foreground',
        className
      )}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = memo(({ className, value, children }) => {
  const context = useContext(TabsContext);
  
  if (context.value !== value) return null;
  
  return (
    <div className={cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}>
      {children}
    </div>
  );
});

TabsContent.displayName = 'TabsContent';

export default Tabs;