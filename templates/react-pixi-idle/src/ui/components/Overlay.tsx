import type { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';
import { IconButton } from './IconButton';
import { popupHeaderClass, popupPanelClass } from './uiPrimitives';

export type OverlayProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  closeLabel?: string;
  width?: string;
  height?: string;
};

export function Overlay({
  title,
  subtitle,
  icon,
  children,
  footer,
  onClose,
  closeLabel = 'Close',
  width = 'min(940px, 100%)',
  height = 'min(760px, 100%)',
}: OverlayProps) {
  return (
    <div
      className="fixed inset-0 z-30 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className={popupPanelClass}
        style={{ width, height }}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={popupHeaderClass}>
          {icon ? <span className="absolute left-4 top-1/2 grid -translate-y-1/2 place-items-center text-2xl text-white">{icon}</span> : null}
          <div className="min-w-0">
            <h2 className="m-0 break-words text-2xl font-black uppercase leading-none">{title}</h2>
            {subtitle ? <p className="m-0 mt-1 text-xs font-extrabold text-slate-300">{subtitle}</p> : null}
          </div>
          <IconButton
            label={closeLabel}
            variant="plain"
            wrapperClassName="absolute right-3 top-1/2 -translate-y-1/2"
            className="h-9 w-9 text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            <FaTimes />
          </IconButton>
        </header>
        <div className="flex min-h-0 flex-1 overflow-y-auto overscroll-contain bg-neutral-100">{children}</div>
        {footer ? <footer className="flex items-center justify-between gap-4 border-t-2 border-neutral-300 bg-neutral-100 p-4">{footer}</footer> : null}
      </section>
    </div>
  );
}
