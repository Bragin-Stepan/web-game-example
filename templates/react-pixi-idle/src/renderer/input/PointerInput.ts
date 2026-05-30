export type PointerInputCallbacks = {
  onPrimaryClick?: (position: { x: number; y: number }) => void;
};

export class PointerInput {
  private canvas: HTMLCanvasElement | null = null;
  private callbacks: PointerInputCallbacks = {};
  private downPosition = { x: 0, y: 0 };
  private dragged = false;

  attach(canvas: HTMLCanvasElement, callbacks: PointerInputCallbacks = {}) {
    this.detach();
    this.canvas = canvas;
    this.callbacks = callbacks;
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointercancel', this.handlePointerCancel);
    canvas.addEventListener('contextmenu', this.preventDefault);
  }

  detach() {
    if (!this.canvas) return;
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointercancel', this.handlePointerCancel);
    this.canvas.removeEventListener('contextmenu', this.preventDefault);
    this.canvas = null;
  }

  private handlePointerDown = (event: PointerEvent) => {
    this.preventDefault(event);
    this.downPosition = { x: event.clientX, y: event.clientY };
    this.dragged = false;
  };

  private handlePointerMove = (event: PointerEvent) => {
    if (Math.abs(event.clientX - this.downPosition.x) > 4 || Math.abs(event.clientY - this.downPosition.y) > 4) {
      this.dragged = true;
    }
  };

  private handlePointerUp = (event: PointerEvent) => {
    this.preventDefault(event);
    if (this.dragged || !this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    this.callbacks.onPrimaryClick?.({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  private handlePointerCancel = () => {
    this.dragged = false;
  };

  private preventDefault = (event: Event) => {
    event.preventDefault();
  };
}
