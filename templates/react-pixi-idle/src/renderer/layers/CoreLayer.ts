import { Container, Graphics, Text } from 'pixi.js';
import type { TemplateGameState } from '../../game/types';

export class CoreLayer {
  readonly view = new Container();

  private core = new Graphics();
  private orbit = new Graphics();
  private label = new Text({ text: '', style: { fill: 0xf8fafc, fontSize: 14 } });

  constructor() {
    this.view.addChild(this.orbit, this.core, this.label);
  }

  update(state: TemplateGameState, width: number, height: number) {
    const centerX = width / 2;
    const centerY = height / 2;
    const pulse = 1 + Math.sin(state.time.totalMs / 450) * 0.05;
    const orbitRadius = Math.min(width, height) * 0.22;
    const orbitAngle = state.time.totalMs / 1400;
    const satelliteX = centerX + Math.cos(orbitAngle) * orbitRadius;
    const satelliteY = centerY + Math.sin(orbitAngle) * orbitRadius;

    this.orbit.clear();
    this.orbit.circle(centerX, centerY, orbitRadius);
    this.orbit.stroke({ color: 0x7dd3fc, alpha: 0.22, width: 2 });
    this.orbit.circle(satelliteX, satelliteY, 8);
    this.orbit.fill({ color: 0xfacc15, alpha: 0.9 });

    this.core.clear();
    this.core.circle(centerX, centerY, 54 * pulse);
    this.core.fill({ color: 0x38bdf8, alpha: 0.95 });
    this.core.circle(centerX, centerY, 28 * pulse);
    this.core.fill({ color: 0x0f172a, alpha: 0.9 });

    this.label.text = `${state.productionPerSecond.toFixed(1)} energy / sec`;
    this.label.anchor.set(0.5);
    this.label.position.set(centerX, centerY + 84);
  }
}
