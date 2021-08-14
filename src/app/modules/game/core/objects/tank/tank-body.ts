import * as PIXI from 'pixi.js';
import { BaseObject, PositionInterface } from '../base';

export class TankBody extends BaseObject {
    constructor(gameApp: PIXI.Application, sprite: PIXI.Sprite) {
        super(gameApp, sprite);
    }

    init(position: PositionInterface) {
        this.sprite.x = position.x;
        this.sprite.y = position.y;
        this.sprite.texture.baseTexture.setResolution(8);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.gameApp.stage.addChild(this.sprite);
    }
}