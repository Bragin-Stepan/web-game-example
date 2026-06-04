import { Graphics } from 'pixi.js';

export class BackgroundLayer {
  readonly view = new Graphics();

  update(width: number, height: number) {
    this.view.clear();
    this.view.rect(0, 0, width, height);
    this.view.fill(0x07321d);

    const step = 48;
    for (let x = 0; x < width + step; x += step) {
      this.view.moveTo(x, 0);
      this.view.lineTo(x, height);
    }
    for (let y = 0; y < height + step; y += step) {
      this.view.moveTo(0, y);
      this.view.lineTo(width, y);
    }
    this.view.stroke({ color: 0xffffff, alpha: 0.05, width: 1 });
  }
}
