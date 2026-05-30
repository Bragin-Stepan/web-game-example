import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  shine?: boolean;
};

export function IconButton({
  label,
  children,
  shine = false,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={['ui-icon-button', shine ? 'ui-shine' : '', className].filter(Boolean).join(' ')}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
