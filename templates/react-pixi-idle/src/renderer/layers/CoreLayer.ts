import { Container, Graphics, Text } from 'pixi.js';
import type { TemplateGameState } from '../../game/types';

export class CoreLayer {
  readonly view = new Container();

  private orbitRing = new Graphics();
  private satellite = new Graphics();
  private coreOuter = new Graphics();
  private coreInner = new Graphics();
  private label = new Text({ text: '', style: { fill: 0xf8fafc, fontSize: 14 } });
  private lastLabelText = '';
  private layoutWidth = 0;
  private layoutHeight = 0;
  private centerX = 0;
  private centerY = 0;
  private orbitRadius = 0;

  constructor() {
    this.satellite.circle(0, 0, 8);
    this.satellite.fill({ color: 0xfacc15, alpha: 0.9 });

    this.coreOuter.circle(0, 0, 54);
    this.coreOuter.fill({ color: 0x38bdf8, alpha: 0.95 });

    this.coreInner.circle(0, 0, 28);
    this.coreInner.fill({ color: 0x0f172a, alpha: 0.9 });

    this.view.addChild(this.orbitRing, this.satellite, this.coreOuter, this.coreInner, this.label);
    this.label.anchor.set(0.5);
  }

  update(state: TemplateGameState, width: number, height: number, renderTimeMs: number) {
    this.updateLayout(width, height);

    const pulse = 1 + Math.sin(renderTimeMs / 450) * 0.05;
    const orbitAngle = renderTimeMs / 1400;
    const satelliteX = this.centerX + Math.cos(orbitAngle) * this.orbitRadius;
    const satelliteY = this.centerY + Math.sin(orbitAngle) * this.orbitRadius;

    this.satellite.position.set(satelliteX, satelliteY);
    this.coreOuter.scale.set(pulse);
    this.coreInner.scale.set(pulse);

    const labelText = `${state.productionPerSecond.toFixed(1)} energy / sec`;
    if (labelText !== this.lastLabelText) {
      this.label.text = labelText;
      this.lastLabelText = labelText;
    }
  }

  private updateLayout(width: number, height: number) {
    if (width === this.layoutWidth && height === this.layoutHeight) return;

    this.layoutWidth = width;
    this.layoutHeight = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.orbitRadius = Math.min(width, height) * 0.22;

    this.orbitRing.clear();
    this.orbitRing.circle(this.centerX, this.centerY, this.orbitRadius);
    this.orbitRing.stroke({ color: 0x7dd3fc, alpha: 0.22, width: 2 });

    this.coreOuter.position.set(this.centerX, this.centerY);
    this.coreInner.position.set(this.centerX, this.centerY);
    this.label.position.set(this.centerX, this.centerY + 84);
  }
}
