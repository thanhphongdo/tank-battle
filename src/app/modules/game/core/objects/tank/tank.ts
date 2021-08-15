import * as PIXI from 'pixi.js';
import { GameApplication } from '../..';
import { GameResource, GameResourseInterface } from '../../resource';
import { PositionInterface } from '../base';
import { TankBarrel } from './tank-barrel';
import { TankBlullet } from './tank-blullet';
import { TankBody } from './tank-body';

export class Tank {
    gameApp: GameApplication;
    tankBody: TankBody;
    tankBarrel: TankBarrel;
    tankBlullet: TankBlullet;
    shootSpeed: number = 500;
    acceptShoot = true;
    constructor(gameApp: GameApplication, gameResource: GameResourseInterface) {
        this.gameApp = gameApp;
        this.tankBody = new TankBody(gameApp.app, new PIXI.Sprite(PIXI.Texture.from(GameResource.TANK_BODY)));
        this.tankBarrel = new TankBarrel(gameApp.app, new PIXI.Sprite(PIXI.Texture.from(GameResource.TANK_BARREL)), this.tankBody);
    }

    init(position: PositionInterface) {
        this.tankBody.init(position);
        this.tankBarrel.init(position);
    }

    shoot() {
        if (!this.acceptShoot) {
            return;
        }
        this.acceptShoot = false;
        setTimeout(() => {
            this.acceptShoot = true;
        }, this.shootSpeed);
        const tankBlullet = new TankBlullet(this.gameApp.app, new PIXI.AnimatedSprite(this.gameApp.gameResource.blullet), this.tankBody, this.tankBarrel);
        tankBlullet.stopCallback = () => {
            tankBlullet.destroy();
        }
        const w = this.tankBarrel.sprite.height;
        const dx = w * Math.cos(this.tankBarrel.currentAngle);
        const dy = w * Math.sin(this.tankBarrel.currentAngle);
        tankBlullet.init({ x: dx + this.tankBarrel.sprite.x, y: dy + this.tankBarrel.sprite.y });
        tankBlullet.sprite.rotation = this.tankBarrel.currentAngle;
        tankBlullet.autoChangeDirection = false;
        tankBlullet.move(tankBlullet.position, {
            x: tankBlullet.sprite.x + Math.cos(this.tankBarrel.currentAngle) * 500,
            y: tankBlullet.sprite.y + Math.sin(this.tankBarrel.currentAngle) * 500
        }, 500)
    }

    onViewClick(e: MouseEvent) {
        this.tankBarrel.autoChangeDirection = false;
        this.tankBarrel.rotate(this.tankBody.position, {
            x: e.clientX,
            y: e.clientY
        });
        this.shoot();
    }

    onViewRightClick(e: MouseEvent) {
        this.tankBody.stop = true;
        this.tankBarrel.stop = true;
        this.tankBarrel.autoChangeDirection = false;
        this.tankBody.move(this.tankBody.position, {
            x: e.clientX,
            y: e.clientY
        }, 100);
        this.tankBarrel.move(this.tankBody.position, {
            x: e.clientX,
            y: e.clientY
        }, 100);
    }
}