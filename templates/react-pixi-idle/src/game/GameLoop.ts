import { useTemplateStore } from './GameStore';

const STEP_MS = 50;

export class GameLoop {
  private running = false;
  private accumulator = 0;
  private lastFrameTime = 0;
  private rafId: number | null = null;
  private onRender: (() => void) | null = null;

  start(onRender?: () => void) {
    if (this.running) return;
    this.running = true;
    this.lastFrameTime = performance.now();
    this.onRender = onRender ?? null;
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private frame = (now: number) => {
    if (!this.running) return;

    const deltaMs = Math.min(now - this.lastFrameTime, 500);
    this.lastFrameTime = now;
    this.accumulator += deltaMs;

    while (this.accumulator >= STEP_MS) {
      useTemplateStore.getState().step(STEP_MS);
      this.accumulator -= STEP_MS;
    }

    this.onRender?.();
    this.rafId = requestAnimationFrame(this.frame);
  };
}
