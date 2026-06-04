import { useTemplateStore } from './GameStore';

const STEP_MS = 250;
const MAX_FRAME_DELTA_MS = 1000;
const MAX_STEPS_PER_FRAME = 4;

export type GameRenderCallback = (renderTimeMs: number) => void;

export class GameLoop {
  private running = false;
  private accumulator = 0;
  private lastFrameTime = 0;
  private renderStartTime = 0;
  private rafId: number | null = null;
  private onRender: GameRenderCallback | null = null;

  start(onRender?: GameRenderCallback) {
    if (this.running) return;
    this.running = true;
    this.accumulator = 0;
    this.lastFrameTime = performance.now();
    this.renderStartTime = this.lastFrameTime;
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

    const deltaMs = Math.min(now - this.lastFrameTime, MAX_FRAME_DELTA_MS);
    this.lastFrameTime = now;
    this.accumulator += deltaMs;

    let steps = 0;
    while (this.accumulator >= STEP_MS && steps < MAX_STEPS_PER_FRAME) {
      useTemplateStore.getState().step(STEP_MS);
      this.accumulator -= STEP_MS;
      steps += 1;
    }

    if (this.accumulator >= STEP_MS) {
      this.accumulator %= STEP_MS;
    }

    this.onRender?.(now - this.renderStartTime);
    this.rafId = requestAnimationFrame(this.frame);
  };
}
