import * as PIXI from 'pixi.js';
import { GameApplication } from '../..';
import { BaseObject, PositionInterface } from '../base';

export class TankBody extends BaseObject {
    constructor(gameApp: GameApplication, sprite: PIXI.Sprite) {
        super(gameApp, sprite);
    }

    init(position: PositionInterface) {
        this.sprite.x = position.x;
        this.sprite.y = position.y;
        this.scale(1 / 8);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.gameApp.app.stage.addChild(this.sprite);
    }
}