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
        <div className="ui-dialog-actions">
          <Button type="button" variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button type="button" variant="primary" shine onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      )}
    >
      <div className="ui-dialog-body">{body}</div>
    </Overlay>
  );
}
