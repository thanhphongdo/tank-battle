import * as PIXI from 'pixi.js';
import { GameApplication } from '../..';
import { BaseObject, PositionInterface } from '../base';
import { TankBlullet } from './tank-blullet';

export class TankMC extends BaseObject {
    tankBlullet: TankBlullet;
    sprite: PIXI.AnimatedSprite;
    constructor(gameApp: GameApplication, sprite: PIXI.AnimatedSprite, tankBlullet: TankBlullet) {
        super(gameApp, sprite);
        this.tankBlullet = tankBlullet;
    }

    init() {
        this.sprite.x = this.tankBlullet.sprite.x;
        this.sprite.y = this.tankBlullet.sprite.y;
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.2);
        this.sprite.gotoAndPlay(10);
        this.gameApp.app.stage.addChild(this.sprite);
        setTimeout(() => {
            this.destroy();
        }, 100);
    }
}