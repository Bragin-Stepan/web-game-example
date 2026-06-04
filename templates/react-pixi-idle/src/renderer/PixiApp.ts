import { Application, Container } from 'pixi.js';
import type { TemplateGameState } from '../game/types';
import { PointerInput, type PointerInputCallbacks } from './input/PointerInput';
import { BackgroundLayer } from './layers/BackgroundLayer';
import { CoreLayer } from './layers/CoreLayer';
import { FxLayer } from './layers/FxLayer';

export class PixiApp {
  app: Application;

  private root = new Container();
  private backgroundLayer = new BackgroundLayer();
  private coreLayer = new CoreLayer();
  private fxLayer = new FxLayer();
  private pointerInput = new PointerInput();
  private width = 0;
  private height = 0;

  constructor() {
    this.app = new Application();
  }

  async init(width: number, height: number, inputCallbacks: PointerInputCallbacks = {}) {
    this.width = width;
    this.height = height;

    await this.app.init({
      width,
      height,
      backgroundColor: 0x07321d,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.root.addChild(this.backgroundLayer.view, this.coreLayer.view, this.fxLayer.view);
    this.app.stage.addChild(this.root);
    this.pointerInput.attach(this.app.canvas, inputCallbacks);
    this.backgroundLayer.update(width, height);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.app.renderer.resize(width, height);
    this.backgroundLayer.update(width, height);
  }

  update(state: TemplateGameState) {
    this.coreLayer.update(state, this.width, this.height);
    this.fxLayer.update(state, this.width, this.height);
  }

  destroy() {
    this.pointerInput.detach();
    this.app.destroy({ removeView: true });
  }
}
