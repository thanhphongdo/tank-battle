import * as PIXI from 'pixi.js';
import { BaseObject, PositionInterface } from '../base';
import { TankBody } from './tank-body';

export class TankBarrel extends BaseObject {
    tank: TankBody
    constructor(gameApp: PIXI.Application, sprite: PIXI.Sprite, tank: TankBody) {
        super(gameApp, sprite);
        this.tank = tank;
    }

    init(position: PositionInterface) {
        this.sprite.x = position.x;
        this.sprite.y = position.y;
        this.sprite.texture.baseTexture.setResolution(8);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.8;
        this.gameApp.stage.addChild(this.sprite);
    }

    rotate(from: PositionInterface, to: PositionInterface) {
        super.rotate(from, to);
        this.sprite.x = this.tank.sprite.x;
        this.sprite.y = this.tank.sprite.y;
    }
}