import * as PIXI from 'pixi.js';
import { GameApplication } from '../..';
import { BaseObject, PositionInterface } from '../base';
import { TankBarrel } from './tank-barrel';
import { TankBody } from './tank-body';

export class TankBlullet extends BaseObject {
    tankBody: TankBody;
    tankBarrel: TankBarrel;
    sprite: PIXI.AnimatedSprite;
    constructor(gameApp: GameApplication, sprite: PIXI.AnimatedSprite, tankBody: TankBody, tankBarrel: TankBarrel) {
        super(gameApp, sprite);
        this.tankBody = tankBody;
        this.tankBarrel = tankBarrel;
    }

    init(position: PositionInterface) {
        this.sprite.x = position.x;
        this.sprite.y = position.y;
        this.sprite.tint = 0xFEFE00;
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.5;
        this.sprite.scale.x = 1 / 4;
        this.sprite.scale.y = 1 / 4;
        this.sprite.play();
        this.gameApp.app.stage.addChild(this.sprite);
    }

    move(from: PositionInterface, to: PositionInterface, speed: number) {
        super.move(from, to, speed);
    }
}