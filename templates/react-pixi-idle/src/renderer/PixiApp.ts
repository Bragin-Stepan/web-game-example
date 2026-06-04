import { Application, Container } from 'pixi.js';
import type { TemplateGameState } from '../game/types';
import { PointerInput, type PointerInputCallbacks } from './input/PointerInput';
import { BackgroundLayer } from './layers/BackgroundLayer';
import { CoreLayer } from './layers/CoreLayer';
import { FxLayer } from './layers/FxLayer';
import { getRenderResolution } from './renderResolution';

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
      antialias: false,
      resolution: getRenderResolution(),
      autoDensity: true,
    });

    this.root.addChild(this.backgroundLayer.view, this.coreLayer.view, this.fxLayer.view);
    this.app.stage.addChild(this.root);
    this.pointerInput.attach(this.app.canvas, inputCallbacks);
    this.backgroundLayer.update(width, height);
    this.fxLayer.resize(width, height);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.app.renderer.resize(width, height);
    this.backgroundLayer.update(width, height);
    this.fxLayer.resize(width, height);
  }

  update(state: TemplateGameState, renderTimeMs: number) {
    this.coreLayer.update(state, this.width, this.height, renderTimeMs);
    this.fxLayer.update(renderTimeMs);
  }

  destroy() {
    this.pointerInput.detach();
    this.app.destroy({ removeView: true });
  }
}
