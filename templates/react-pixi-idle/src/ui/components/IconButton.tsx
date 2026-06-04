import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Tooltip } from './Tooltip';
import { iconButtonBaseClass, iconButtonVariantClass, shineClass } from './uiPrimitives';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  shine?: boolean;
  variant?: 'panel' | 'plain';
  showTooltip?: boolean;
  tooltipPlacement?: 'top' | 'bottom';
  wrapperClassName?: string;
};

export function IconButton({
  label,
  children,
  shine = false,
  variant = 'panel',
  showTooltip = false,
  tooltipPlacement = 'bottom',
  wrapperClassName = '',
  className = '',
  ...props
}: IconButtonProps) {
  const button = (
    <button
      {...props}
      className={cn(iconButtonBaseClass, iconButtonVariantClass[variant], shine && shineClass, className)}
      aria-label={label}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );

  if (showTooltip) {
    return (
      <Tooltip label={label} placement={tooltipPlacement} className={wrapperClassName}>
        {button}
      </Tooltip>
    );
  }

  return wrapperClassName ? <span className={wrapperClassName}>{button}</span> : button;
}
