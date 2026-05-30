import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

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
      className={[
        'ui-button',
        `ui-button-${variant}`,
        shine ? 'ui-shine' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {icon ? <span className="ui-button-icon">{icon}</span> : null}
      {children ? <span className="ui-button-label">{children}</span> : null}
    </button>
  );
}
