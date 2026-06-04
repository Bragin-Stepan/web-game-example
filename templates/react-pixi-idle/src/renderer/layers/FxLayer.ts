import { Graphics } from 'pixi.js';

export class FxLayer {
  readonly view = new Graphics();

  private width = 0;
  private height = 0;

  resize(width: number, height: number) {
    if (width === this.width && height === this.height) return;

    this.width = width;
    this.height = height;
    this.view.clear();
    this.view.rect(0, 0, width, height);
    this.view.fill({ color: 0x38bdf8, alpha: 1 });
  }

  update(renderTimeMs: number) {
    this.view.alpha = 0.04 + Math.sin(renderTimeMs / 900) * 0.015;
  }
}
