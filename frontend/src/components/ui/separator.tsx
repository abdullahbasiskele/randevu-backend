import * as React from 'react';

import { cn } from '@/lib/utils';

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical';
};

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => {
    const isHorizontal = orientation === 'horizontal';
    return (
      <div
        ref={ref}
        className={cn(
          'shrink-0 bg-border',
          isHorizontal ? 'h-px w-full' : 'h-full w-px',
          className,
        )}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    );
  },
);
Separator.displayName = 'Separator';

export { Separator };
