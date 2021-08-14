import * as PIXI from 'pixi.js';
import { BaseObject } from './base';

export class TankBody extends BaseObject {
    constructor(gameApp: PIXI.Application, sprite: PIXI.Sprite) {
        super(gameApp, sprite);
        this.init();
    }

    init() {
        this.sprite.x = 500;
        this.sprite.y = 500;
        this.sprite.texture.baseTexture.setResolution(8);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.gameApp.stage.addChild(this.sprite);
    }
}