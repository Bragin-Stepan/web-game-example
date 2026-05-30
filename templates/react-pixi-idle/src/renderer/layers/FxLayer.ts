import { Container, Graphics } from 'pixi.js';
import type { TemplateGameState } from '../../game/types';

export class FxLayer {
  readonly view = new Container();

  private glow = new Graphics();

  constructor() {
    this.view.addChild(this.glow);
  }

  update(state: TemplateGameState, width: number, height: number) {
    const alpha = 0.04 + Math.sin(state.time.totalMs / 900) * 0.015;
    this.glow.clear();
    this.glow.rect(0, 0, width, height);
    this.glow.fill({ color: 0x38bdf8, alpha });
  }
}
