import type { ReactNode } from 'react';
import { Button } from './Button';
import { Overlay } from './Overlay';

export type ConfirmDialogProps = {
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Overlay
      title={title}
      onClose={onCancel}
      width="min(460px, 100%)"
      height="auto"
      footer={(
        <div className="flex w-full justify-end gap-2.5">
          <Button type="button" variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button type="button" variant="primary" shine onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      )}
    >
      <div className="grid w-full gap-4 p-4">{body}</div>
    </Overlay>
  );
}
