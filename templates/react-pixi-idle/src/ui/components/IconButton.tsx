import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Tooltip } from './Tooltip';
import { iconButtonBaseClass, iconButtonVariantClass, shineClass } from './uiPrimitives';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  shine?: boolean;
  variant?: 'panel' | 'plain';
  tooltipPlacement?: 'top' | 'bottom';
  wrapperClassName?: string;
};

export function IconButton({
  label,
  children,
  shine = false,
  variant = 'panel',
  tooltipPlacement = 'bottom',
  wrapperClassName = '',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <Tooltip label={label} placement={tooltipPlacement} className={wrapperClassName}>
      <button
        {...props}
        className={cn(iconButtonBaseClass, iconButtonVariantClass[variant], shine && shineClass, className)}
        aria-label={label}
      >
        <span className="relative z-10">{children}</span>
      </button>
    </Tooltip>
  );
}
