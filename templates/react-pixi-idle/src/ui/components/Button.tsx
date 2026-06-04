import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { buttonBaseClass, buttonVariantClass, shineClass } from './uiPrimitives';

type ButtonVariant = keyof typeof buttonVariantClass;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
  shine?: boolean;
};

export function Button({
  variant = 'secondary',
  icon,
  shine = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(buttonBaseClass, buttonVariantClass[variant], shine && shineClass, className)}
    >
      {icon ? <span className="relative z-10 inline-grid place-items-center">{icon}</span> : null}
      {children ? <span className="relative z-10">{children}</span> : null}
    </button>
  );
}
