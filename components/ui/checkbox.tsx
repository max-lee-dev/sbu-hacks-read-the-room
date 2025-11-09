'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, id, children, ...props }, ref) => {
    return (
      <label className={cn('flex gap-3 items-center cursor-pointer relative', className)} htmlFor={id}>
        <div className="relative w-5 h-5">
          <input
            type="checkbox"
            className="hidden peer"
            ref={ref}
            checked={checked}
            id={id}
            {...props}
          />
          <span
            className={cn(
              'w-5 h-5 border rounded relative flex items-center justify-center transition-colors',
              checked
                ? 'border-[#3ECF8E] bg-[#3ECF8E]'
                : 'border-[#404040] bg-[#2D2D2D]'
            )}
          />
          <svg
            className={cn(
              'absolute hidden peer-checked:block',
              'left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2',
              'w-[11px] h-[8px]'
            )}
            viewBox="0 0 11 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m10.092.952-.005-.006-.006-.005A.45.45 0 0 0 9.43.939L4.162 6.23 1.585 3.636a.45.45 0 0 0-.652 0 .47.47 0 0 0 0 .657l.002.002L3.58 6.958a.8.8 0 0 0 .567.242.78.78 0 0 0 .567-.242l5.333-5.356a.474.474 0 0 0 .044-.65Zm-5.86 5.349V6.3Z"
              fill="#1A1A1A"
              stroke="#1A1A1A"
              strokeWidth=".5"
            />
          </svg>
        </div>
        {children && (
          <span className="text-sm select-none" style={{ color: '#B0B0B0' }}>
            {children}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };

