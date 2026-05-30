import type { ReactNode } from 'react';
import { IconButton } from './IconButton';

export type OverlayProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  width?: string;
  height?: string;
};

export function Overlay({
  title,
  subtitle,
  children,
  footer,
  onClose,
  width = 'min(940px, 100%)',
  height = 'min(760px, 100%)',
}: OverlayProps) {
  return (
    <div className="ui-overlay-backdrop" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="ui-panel" style={{ width, height }} onClick={(event) => event.stopPropagation()}>
        <header className="ui-panel-header">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <IconButton label="Close" onClick={onClose}>x</IconButton>
        </header>
        <div className="ui-panel-body">{children}</div>
        {footer ? <footer className="ui-panel-footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
