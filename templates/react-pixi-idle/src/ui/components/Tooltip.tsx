import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export type TooltipProps = {
  label: string;
  placement?: 'top' | 'bottom';
  className?: string;
  children: ReactNode;
};

export function Tooltip({ label, placement = 'bottom', className = '', children }: TooltipProps) {
  const placementClass = placement === 'top'
    ? 'bottom-[calc(100%+8px)]'
    : 'top-[calc(100%+8px)]';
  const positionClass = /\b(absolute|fixed|relative|sticky)\b/.test(className) ? '' : 'relative';

  return (
    <span className={cn('group inline-flex', positionClass, className)}>
      {children}
      <span
        className={cn(
          'pointer-events-none absolute left-1/2 z-[80] w-max max-w-[220px] -translate-x-1/2 translate-y-0.5',
          'rounded-md bg-neutral-950 px-2 py-1.5 text-xs font-extrabold leading-tight text-white opacity-0',
          'transition duration-100 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100',
          placementClass,
        )}
        role="tooltip"
      >
        {label}
      </span>
    </span>
  );
}
